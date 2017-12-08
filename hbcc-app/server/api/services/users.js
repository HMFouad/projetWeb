const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require ('../check-auth');
const User = require('../mongoose/model/user.model');

// Get users
router.get('/users/:id', (req, res) => {
    checkAuth(req, res, (user) => {
        res.json({
            success: true
        })
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
router.post('/users', (req, res) => {console.log (req.body)
    console.log('11111111111111111111')
    res.json("Message!!!!!!!!!!!!")
        firstName=req.body.firstName;
        lastName=req.body.lastName;
        password=req.body.password;
        //rpassword=req.body.rpassword;
        email=req.body.email;
        //speciality=req.body.speciality;

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            //rpassword=req.body.rpassword;
            email: req.body.email,
            speciality: req.body.speciality
        });

        user.save((err, results) => {
            if (err) {
                console.log(err);
                } else {
                 console.log(results);
            }
        });
        //User.insert
        /*
    //mongoose.users.insert( {
        firstName: firstName,
        lastName: lastName,
        email: email,        
        speciality: "Master 2 Génie Logiciel",
        password: password,
     } );*/

    });


module.exports = router;
