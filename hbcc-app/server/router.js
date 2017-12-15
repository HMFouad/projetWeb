const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express();
const dbConnection = require ('./mongoose/db-connection');
const apiRouting = require('./api/api-router');
const constants = require('./constants');

const dbConfigProd = require('./mongoose/db-config');
const dbConfigTest = require('./mongoose/db-config');

// Parsers
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Angular DIST output folder
router.use(express.static(path.join(__dirname, '../dist')));

// API location
router.use('/api', apiRouting);

// Send all other requests to the Angular router
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist'));
});

module.exports = router;
