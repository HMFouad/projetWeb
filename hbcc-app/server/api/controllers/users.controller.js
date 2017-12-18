const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const checkAuth = require('../utils/check-auth');
const validator = require('validator');
const request = require('request');
const User = require('../../mongoose/model/user.model');
const Speciality = require('../../mongoose/model/speciality.model');
const encrypt = require('../utils/encrypt');
const throwInternalServerError = require('../utils/throw-internal-server-error');
const statusCodes = require('../../status-codes');
const doPatchUser = require('../utils/do-patch-user');
const router = express.Router();

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

// Get users
router.get('/users/:id', (req, res) => {
    checkAuth(req).then((user) => {
        if (user._id === req.params.id) {
            delete user.password;
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
 * Service to change settings of a user
 *
 * required parameters:
 *  * body
 *      * email: (string email)
 *      * firstName: (string)
 *      * lastName: (string)
 *      * speciality: id of the speciality (string)
 *      * newPassword: (string)
 *      * cnewPassword: (string)
 *      * password: (string)
 */
router.patch('/users/:id', (req, res) => {

    const body = req.body;
    const givenEmail = body.email;
    const givenFirstName = body.firstName;
    const givenLastName = body.lastName;
    const givenSpecialityId = body.speciality;
    const givenNewPassword = body.newPassword;
    const givenConfirmNewPassword = body.confirmNewPassword;
    const givenPassword = body.password;

    const userIdToChange = req.params.id;


    // TODO import bcrypt et checkAuth

    checkAuth(req).then((user) => {
        if (`${user._id}` === `${userIdToChange}`) {

            if (givenEmail && !validator.isEmail(givenEmail)) {
                res.status(statusCodes.BAD_REQUEST)
                    .json({ success: false, message: `L'email est invalide` });
            }
            else {
                User.findOne({ email: givenEmail }, (userErr, emailFound) => {
                    if (userErr) {
                        throwInternalServerError(res);
                    }
                    else if (givenEmail && emailFound === givenEmail && user.email !== givenEmail) {
                        res.status(statusCodes.BAD_REQUEST)
                            .json({ success: false, message: `L'email choisi existe déjà.` });
                    }
                    else {

                        bcrypt.compare(givenPassword, user.password, (errPassword, isRightPassword) => {
                            if (isRightPassword) {
                                const newSettings = {};


                                if (givenEmail) {
                                    newSettings.email = givenEmail;
                                }

                                if (givenFirstName) {
                                    newSettings.firstName = givenFirstName;
                                }

                                if (givenLastName) {
                                    newSettings.lastName = givenLastName;
                                }

                                if (givenNewPassword) {
                                    if (`${givenNewPassword}` === `${givenConfirmNewPassword}`) {
                                        encrypt(givenNewPassword.toString()).then((encryptedPassword) => {
                                            newSettings.password = encryptedPassword;
                                            if (givenSpecialityId) {
                                                Speciality.findOne({ _id: givenSpecialityId }, (specialityErr, speciality) => {
                                                    if (specialityErr) {
                                                        throwInternalServerError(res);
                                                    }
                                                    else if (!speciality) {
                                                        res.status(statusCodes.BAD_REQUEST)
                                                            .json({ success: false, message: 'La spécialité donnée est inconnue.' });
                                                    }
                                                    else {
                                                        newSettings.speciality = givenSpecialityId;
                                                        const lenghtNewSettings = Object.keys(newSettings).length;

                                                        if (lenghtNewSettings > 0) {
                                                            doPatchUser(newSettings, userIdToChange).then(() => {
                                                                res.status(statusCodes.SUCCESS)
                                                                    .json({ success: true, message: 'SUCCESS.' });
                                                            }).catch(() => {
                                                                throwInternalServerError(res);
                                                            });
                                                        }
                                                        else {
                                                            res.status(statusCodes.BAD_REQUEST)
                                                                .json({ success: false, message: `Aucun paramètre n'a été changé.` });
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                const lenghtNewSettings = Object.keys(newSettings).length;

                                                if (lenghtNewSettings > 0) {
                                                    doPatchUser(newSettings, userIdToChange).then(() => {
                                                        res.status(statusCodes.SUCCESS)
                                                            .json({ success: true, message: 'SUCCESS.' });
                                                    }).catch(() => {
                                                        throwInternalServerError(res);
                                                    });
                                                }
                                                else {
                                                    res.status(statusCodes.BAD_REQUEST)
                                                        .json({ success: false, message: `Aucun paramètre n'a été changé.` });
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        res.status(statusCodes.BAD_REQUEST)
                                            .json({ success: false, message: `Le nouveau mot de passe et sa confirmation ne correspondent pas.` });
                                    }
                                }
                                else if (givenSpecialityId) {
                                    Speciality.findOne({ _id: givenSpecialityId }, (specialityErr, speciality) => {
                                        if (specialityErr) {
                                            throwInternalServerError(res);
                                        }
                                        else if (!speciality) {
                                            res.status(statusCodes.BAD_REQUEST)
                                                .json({ success: false, message: 'La spécialité donnée est inconnue.' });
                                        }
                                        else {
                                            newSettings.speciality = givenSpecialityId;

                                            doPatchUser(newSettings, userIdToChange).then(() => {
                                                res.status(statusCodes.SUCCESS)
                                                    .json({ success: true, message: 'SUCCESS.' });
                                            }).catch(() => {
                                                throwInternalServerError(res);
                                            });
                                        }
                                    });
                                }
                                else {
                                    const lenghtNewSettings = Object.keys(newSettings).length;

                                    if (lenghtNewSettings > 0) {
                                        doPatchUser(newSettings, userIdToChange).then(() => {
                                            res.status(statusCodes.SUCCESS)
                                                .json({ success: true, message: 'SUCCESS.' });
                                        }).catch(() => {
                                            throwInternalServerError(res);
                                        });
                                    }
                                    else {
                                        res.status(statusCodes.BAD_REQUEST)
                                            .json({ success: false, message: `Aucun paramètre n'a été changé.` });
                                    }
                                }
                            }
                            else {
                                res.status(statusCodes.BAD_REQUEST)
                                    .json({ success: false, message: `L'ancien mot de passe n'est pas correct` });
                            }
                        });
                    }
                });
            }
        }
        else {
            res.status(statusCodes.BAD_REQUEST)
                .json({ success: false, message: `Vous n'êtes autorisé à modifier que votre profil` });
        }
    }).catch((throwErr) => {
        throwErr(res);
    });

});


module.exports = router;
