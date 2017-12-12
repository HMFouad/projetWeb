const express = require('express');
const router = express.Router();
const checkAuth = require('../utils/check-auth');
const User = require('../mongoose/model/user.model');
const Speciality = require('../mongoose/model/speciality.model');
const encrypt = require('../utils/encrypt');
const request = require('request');

// Get users
router.get('/users/:id', (req, res) => {
    checkAuth(req, res, (user) => {
        res.json({
            success: true,
            user: user
        });
    });
});

// Registration service
router.post('/users', (req, res) => {
    console.log ('Request POST /users');
    console.log (encrypt(req.body.password))
    console.log ('ON PASSE ICI ')
    Speciality.findOne({ _id: req.body.speciality }, (speciality_err, spec) => {
        if (speciality_err) {
            // TODO
            console.log("Speciality Error : " + speciality_err);
        }
        else if (!spec) {
            // TODO
        }
        else {
            // TODO verifier paramtres de l'utilisateur
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: encrypt(req.body.password),
                email: req.body.email,
                speciality: spec._id
            });

            // TODO vérifier que l'email n'existe pas
            user.save(function (user_err, results) {
                if (user_err || !results) {
                    console.log("User Error: " + user_err);
                }
                else {
                    const authenticationRequest = {
                        url: `http://${req.headers.host}/api/tokens`,
                        method: 'POST',
                        form: {
                            email: req.body.email,
                            password: req.body.password
                        }
                    };

                    console.log (authenticationRequest)
                    request(authenticationRequest, (authErr, response, body) => {
                        // TODO HANDLE ERROR
                        console.log ('RESULT POST /tokens')
                        res.json(JSON.parse(body));
                    })
                }
            });
        }

    });
});

module.exports = router;
