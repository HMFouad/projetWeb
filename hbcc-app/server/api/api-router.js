const express = require('express');
const router = express.Router();
const controllers = [
    require('./controllers/users.controller'),
    require('./controllers/tokens.controller'),
    require('./controllers/events.controller'),
    require('./controllers/specialities.controller')
];

// attach all controllers
for (const controller of controllers) {
    router.use('/', controller);
}

module.exports = router;
