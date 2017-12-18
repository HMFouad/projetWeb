const User = require('../../mongoose/model/user.model');
const throwInternalServerError = require('./throw-internal-server-error');

function doPatchUser (newSettings, userID) {
    return new Promise((resolve, reject) => {
        User.update({ _id: userID }, newSettings, (err, user) => {
            if (err || !user) {
                reject(throwInternalServerError);
            }
            else { 
                resolve(user);
            }
        });
    });
}

module.exports = doPatchUser;