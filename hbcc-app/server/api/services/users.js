const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = require ('../mongoose/connection');

// Get users
router.get('/', (req, res) => {
    connection((db) => {
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
router.post('/', (req, res) => {
    console.log('11111111111111111111')
    res.json("Message!!!!!!!!!!!!")
        firstName=req.body.firstName;
        lastName=req.body.lastName;
        password=req.body.password;
        //rpassword=req.body.rpassword;
        email=req.body.email;
        //speciality=req.body.speciality;

    mongoose.users.insert( {
        firstName: firstName,
        lastName: lastName,
        email: email,        
        speciality: "Master 2 Génie Logiciel",
        password: password,
     } );

    });


module.exports = router;
