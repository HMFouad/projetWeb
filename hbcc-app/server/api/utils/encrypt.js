const bcrypt = require('bcrypt-nodejs');

/**
 * Encrypt a password
 * Encrypted password givent to the success handler of the promise.
 * @param {string} text
 *
 * @return {Promise}
 */
module.exports = (text) => {
    const rounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(rounds, (err, salt) => {
            if (err) {
                reject(err);
            }

            bcrypt.hash(text, salt, null,   (err, hash) => {
                if (err) {
                    reject(err);
                }

                resolve(hash);
            });
        });
    });
};
