const express = require('express');
const validator = require('validator');

const request = require('request');

const User = require('../../mongoose/model/user.model');
const Speciality = require('../../mongoose/model/speciality.model');

const checkAuth = require('../utils/check-auth');
const encrypt = require('../utils/encrypt');
const throwInternalServerError = require('../utils/throw-internal-server-error');
const statusCodes = require('../../status-codes');

const router = express.Router();

// Get users
router.get('/users/:id', (req, res) => {
    checkAuth(req)
        .then((user) => {
            if (user._id === req.params.id) {
                res.json(user);
            }
            else {
                res.status(statusCodes.UNAUTHORIZED)
                    .json({ success: false, message: `Current user is not allowed to see other users` });
            }
        })
        .catch((throwErr) => {
            throwErr(res);
        });
});

/**
 * Service to create users
 *
 * required parameters:
 *  * body
 *      * email: (string email)
 *      * password: (string)
 *      * firstName: (string)
 *      * lastName: (string)
 *      * speciality: id of the speciality (string)
 */
router.post('/users', (req, res) => {

    const body = req.body;
    const givenEmail = body.email;
    const givenPassword = body.password;
    const givenFirstName = body.firstName;
    const givenLastName = body.lastName;
    const givenSpecialityId = body.speciality;

    if (!givenEmail ||
        !givenPassword ||
        !givenFirstName ||
        !givenLastName ||
        !givenSpecialityId) {
        res.status(statusCodes.BAD_REQUEST)
           .json({ success: false, message: 'Un paramètre est manquant.', body: req.body });
    }
    else if (!validator.isEmail(givenEmail)) {
        res.status(statusCodes.BAD_REQUEST)
            .json({ success: false, message: `L'email est invalide` });
    }
    else {
        // check if the email already exist in the database
        User.findOne({ email: givenEmail }, (userErr, user) => {
            if (userErr) {
                throwInternalServerError(res);
            }
            else if (user) {
                res.status(statusCodes.BAD_REQUEST)
                   .json({ success: false, message: `L'email choisi existe déjà.` });
            }
            else {
                // check if the given speciality is a right speciality
                Speciality.findOne({ _id: givenSpecialityId }, (specialityErr, speciality) => {
                    if (specialityErr) {
                        throwInternalServerError(res);
                    }
                    else if (!speciality) {
                        res.status(statusCodes.BAD_REQUEST)
                            .json({ success: false, message: 'La spécialité donnée est inconnue.' });
                    }
                    else {
                        encrypt(givenPassword.toString()).then((encryptedPassword) => {
                            // we create user
                            const user = new User({
                                email: givenEmail,
                                password: encryptedPassword,
                                firstName: givenFirstName,
                                lastName: givenLastName,
                                speciality: speciality._id
                            });

                            user.save(function (userErr, results) {
                                if (userErr || !results) {
                                    throwInternalServerError(res);
                                }
                                else {
                                    // if inscription succeed we call the POST tokens Service
                                    const authenticationRequest = {
                                        url: `http://${req.headers.host}/api/tokens`,
                                        method: 'POST',
                                        form: {
                                            email: req.body.email,
                                            password: req.body.password
                                        }
                                    };

                                    request(authenticationRequest, (authErr, response, body) => {
                                        if (authErr || response.status) {
                                            throwInternalServerError(res);
                                        }
                                        else {
                                            // we return exactly the response of POST tokens
                                            res.json(JSON.parse(body));
                                        }
                                    });
                                }
                            });
                        }).catch(() => {
                            throwInternalServerError(res);
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;
