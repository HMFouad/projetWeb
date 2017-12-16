const crypto = require('crypto');
const base64url = require('base64url');
const tokenLength = require('../../constants').TOKEN_LENGTH;

/**
 * Return a token.
 * @return {string}
 */
function generateToken() {
    return base64url(crypto.randomBytes(tokenLength));
}

module.exports = generateToken;
