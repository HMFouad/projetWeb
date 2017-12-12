const statuscode = require('../status-code');
const User = require('./mongoose/model/user.model');
const Token = require('./mongoose/model/token.model');
const internalServerError = require('./utils/internal_server_error');

/**
 * Check given authentification token & return api error if invalid
 * if the token is valid call success_handler with attached user.
 *
 * Token value should be given in req.headers.authorization like 'Bearer %value%'
 */
module.exports = (req, res, success_handler) => {

    const splittedAuthorization = req.headers.authorization ? req.headers.authorization.split(' ') : [];

    if (splittedAuthorization[0] &&
        splittedAuthorization[1] &&
        splittedAuthorization[0] === 'Bearer') {

        const token = splittedAuthorization[1];
        Token.findOne({ value: token }, (tokenErr, token) => {
            if (tokenErr) {
                internalServerError(res);
            }
            else if (!token) {
                res.status(statuscode.FORBIDDEN).json({ success: false, message: "Can't access" });
            }
            else {
                const tokenExpiration = new Date (token.expiresAt);
                const now = new Date ();
                if (tokenExpiration.getTime() > now.getTime()) {
                    User.findOne({ authToken: token._id }, (userError, user) => {
                        if (userError) {
                            internalServerError(res);
                        }
                        else if (!user) {
                            res.status(statuscode.FORBIDDEN).json({ success: false, message: "Can't access" });
                        }
                        else {
                            success_handler(user);
                        }
                    });
                }
                else { // token invalid
                    res.status(statuscode.FORBIDDEN).json({ success: false, message: "Token has expired" });
                }
            }
        });
    }
    else {
        res.status(statuscode.FORBIDDEN).json({ success: false, message: "Can't access" });
    }
};
