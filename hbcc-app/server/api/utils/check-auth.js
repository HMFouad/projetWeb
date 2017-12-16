const statusCodes = require('../../status-codes');
const User = require('../../mongoose/model/user.model');
const Token = require('../../mongoose/model/token.model');
const throwInternalServerError = require('./throw-internal-server-error');

/**
 * Check given authentication token and return throw error if invalid.
 *
 * Token value should be given in req.headers.authorization like 'Bearer %value%'
 *
 * The then is called with user in parameter.
 * The catch is called with a parameter function which throw error with res request in parameter.
 * @return {Promise}
 */
function checkAuth (req) {
    const splittedAuthorization = req.headers.authorization ?
        req.headers.authorization.split(' ') :
        [];

    return new Promise((resolve, reject) => {
        if (splittedAuthorization[0] &&
            splittedAuthorization[1] &&
            splittedAuthorization[0] === 'Bearer') {

            const token = splittedAuthorization[1];
            Token.findOne({ value: token }, (tokenErr, token) => {
                if (tokenErr) {
                    reject(throwInternalServerError);
                }
                else if (!token) {
                    reject((res) => {
                        res.status(statusCodes.UNAUTHORIZED).json({
                            success: false,
                            message: "Le token d'authentification est invalide."
                        });
                    });
                }
                else {
                    const tokenExpiration = new Date(token.expiresAt);
                    const now = new Date();
                    if (tokenExpiration.getTime() > now.getTime()) {
                        User.findOne({ authToken: token._id }, (userError, user) => {
                            if (userError) {
                                reject(throwInternalServerError);
                            }
                            else if (!user) {
                                reject((res) => {
                                    res.status(statusCodes.UNAUTHORIZED)
                                       .json({ success: false, message: "Le token d'authentification est invalide." });
                                });
                            }
                            else {
                                resolve(user);
                            }
                        });
                    }
                    else { // token invalid
                        reject((res) => {
                            res.status(statusCodes.UNAUTHORIZED)
                               .json({ success: false, message: "Le token d'authentification est invalide." });
                        });
                    }
                }
            });
        }
        else {
            reject((res) => {
                res.status(statusCodes.UNAUTHORIZED)
                    .json({ success: false, message: "Le token d'authentification est invalide." });
            });
        }
    });
}

module.exports = checkAuth;
