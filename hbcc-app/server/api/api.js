const express = require('express');
const router = express.Router();
const usersRoutes = require('./services/users');
const tokensRoutes = require('./services/tokens');
const eventsRoutes = require('./services/events');

router.use('/users', usersRoutes);
router.use('/tokens', tokensRoutes);
router.use('/events', eventsRoutes);

module.exports = router;
