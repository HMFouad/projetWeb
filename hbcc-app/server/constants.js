/**
 * All constant for the server side.
 * @type {Object.<string,string|number>}
 */
module.exports = {
    TOKEN_DELAY: 1800, // seconds
    TOKEN_LENGTH: 30,

    HOST_PORT: process.env.PORT || '8080'
};
