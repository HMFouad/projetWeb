const Token = require('../../mongoose/model/token.model');

// TODO change name get-token ?

/**
 * Check if the token exists: then of the returned promise is the success handler.
 *
 * @param {string} tokenValue value of the token which should exist
 * @param {string} tokenExpiration Expiration date of the token which should exist
 *
 * @return {Promise}
 */
function tokenExists (tokenValue, tokenExpiration) {
    return new Promise((resolve) => {
        Token.findOne({ value: tokenValue, expiresAt: tokenExpiration }, (err, res) => {
            if (err || !res) {
                throw new Error('not exists');
            }
            else {
                resolve();
            }
        });
    });
}

module.exports = tokenExists;
