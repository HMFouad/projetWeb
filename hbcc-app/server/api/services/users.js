const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const mongooseStruct = require('../mongooseStruct');
const connection = require ('../mongoose-connection');


// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

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
    connection((db) => {
        res.json({
            success: true
        })



        firstName=req.body.firstName;
        lastName=req.body.lastName;
        password=req.body.password;
        rpassword=req.body.rpassword;
        email=req.body.email;
        //speciality=req.body.speciality;

    if (password == rpassword){

    mongoose.users.insert( {
        firstName: firstName,
        lastName: lastName,
        password: password, email: email, speciality: "Master 2 Génie Logiciel" } );
    }
    else{
        console.log("password not match!!!");
      }

    });
});

module.exports = router;
