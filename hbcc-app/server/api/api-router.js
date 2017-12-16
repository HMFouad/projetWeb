const express = require('express');
const router = express.Router();
const usersRoutes = require('./controllers/users.controller');
const tokensRoutes = require('./controllers/tokens.controller');
const eventsRoutes = require('./controllers/events.controller');
const specialitiesRoutes = require('./controllers/specialities.controller');

const EMPTY_ROUTE = '/';

router.use(EMPTY_ROUTE, usersRoutes);
router.use(EMPTY_ROUTE, tokensRoutes);
router.use(EMPTY_ROUTE, eventsRoutes);
router.use(EMPTY_ROUTE, specialitiesRoutes);

module.exports = router;
