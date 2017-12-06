const express = require('express');
const router = express.Router();
const usersRoutes = require('./services/users');
const tokensRoutes = require('./services/tokens');
const eventsRoutes = require('./services/events');
const specialitiesRoutes = require('./services/specialities');

router.use('/', usersRoutes);
router.use('/', tokensRoutes);
router.use('/', eventsRoutes);
router.use('/', specialitiesRoutes);

module.exports = router;
