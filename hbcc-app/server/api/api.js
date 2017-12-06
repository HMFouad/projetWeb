const express = require('express');
const router = express.Router();
const usersRoutes = require('./services/users');
const tokensRoutes = require('./services/tokens');
const eventsRoutes = require('./services/events');

router.use('/', usersRoutes);
router.use('/', tokensRoutes);
router.use('/', eventsRoutes);

module.exports = router;
