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
	console.log("TESTS");
	console.log("TESTS");
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


module.exports = router;
