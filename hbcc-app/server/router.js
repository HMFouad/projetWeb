const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express();
const apiRouting = require('./api/api-router');
const statusCodes = require('./status-codes');

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

// throw error if path is not known
router.use((req, res) => {
    res.status(statusCodes.NOT_FOUND)
       .json({ message: 'Page not found.' });
});

module.exports = router;
