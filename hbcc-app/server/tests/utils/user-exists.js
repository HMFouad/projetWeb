const User = require('../../mongoose/model/user.model');

/**
 * Check if the user exists: then of the returned promise is the success handler.
 *
 * @param {string} id Id of the user which should exist
 *
 * @return {Promise}
 */
function userExists (id) {
    return new Promise((resolve) => {
        User.findOne({ _id: id }, (err, user) => {
            if (err || !user) {
                throw new Error('not exists');
            }
            else {
                resolve(user);
            }
        });
    });
}

module.exports = userExists;
