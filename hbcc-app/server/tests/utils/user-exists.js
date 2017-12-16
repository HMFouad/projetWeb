const User = require('../../mongoose/model/user.model');

// TODO change name : get-user

/**
 * Check if the user exists: then of the returned promise is the success handler.
 *
 * @param {string} id Id of the user which should exist
 *
 * @return {Promise}
 */
function userExists (id) {
    return new Promise((resolve) => {
        User.findOne({ _id: id }, (err, res) => {
            if (err || !res) {
                throw new Error('not exists');
            }
            else {
                resolve();
            }
        });
    });
}

module.exports = userExists;
