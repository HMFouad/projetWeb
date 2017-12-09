const express = require('express');
const router = express.Router();
const checkAuth = require ('../check-auth');
const User = require('../mongoose/model/user.model');
const Speciality = require('../mongoose/model/speciality.model');
const Encrypt = require('./encrypt');

// Get users
router.get('/users/:id', (req, res) => {
    checkAuth(req, res, (user) => {
        res.json({
            success: true
        });
        /*db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });*/
    });
});

// Registration service
router.post('/users', (req, res) => {
    Speciality.findOne({ name: req.body.speciality }, (speciality_err, spec) => {
        if (speciality_err) {
            console.log("Speciality Error : " + speciality_err);
        }
        else {
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: Encrypt.encrypt(req.body.password),
                    email: req.body.email,
                    speciality: spec._id
                });

                user.save(function(user_err, results) {
                    if (user_err) {
                        console.log("User Error: " + user_err);
                        }
                        else {
                        console.log("Resultat: " + results);
                    }
                });
            }

    });
});

module.exports = router;
