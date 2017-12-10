
const crypto = require('crypto');

const algorithm = 'aes-256-ctr',
      pass = 'd6F3Efeq';

/**
 * Encrypt the given text.
 * @param {string} plainValue Text to encrypt.
 * @return {string}
 */
module.exports = (plainValue) => {
    const cipher = crypto.createCipher(algorithm, pass);
    let crypted = cipher.update(plainValue, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
