const Token = require('./model/token.model');
const User = require('./model/user.model');
const Speciality = require('./model/speciality.model');
const Event = require('./model/event.model');

/**
 * We export all mongoose models.
 * @type {{Event: *, Speciality: *, Token: *, User: *}}
 */
module.exports = { Event, Speciality, Token, User };
