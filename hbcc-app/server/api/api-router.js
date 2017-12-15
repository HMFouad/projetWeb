const express = require('express');
const router = express.Router();
const usersRoutes = require('./controllers/users');
const tokensRoutes = require('./controllers/tokens');
const eventsRoutes = require('./controllers/events');
const specialitiesRoutes = require('./controllers/specialities');

const EMPTY_ROUTE = '/';

router.use(EMPTY_ROUTE, usersRoutes);
router.use(EMPTY_ROUTE, tokensRoutes);
router.use(EMPTY_ROUTE, eventsRoutes);
router.use(EMPTY_ROUTE, specialitiesRoutes);

module.exports = router;