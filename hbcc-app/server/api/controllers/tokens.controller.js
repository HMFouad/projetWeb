const express = require("express");
const router = express.Router();
const User = require("../../mongoose/model/user.model");
const statusCodes = require("../../status-codes");
const Token = require("../../mongoose/model/token.model");
const constants = require("../../constants");
const throwInternalServerError = require("../utils/throw-internal-server-error");
const encrypt = require("../utils/encrypt");
const generateToken = require('../utils/generate-token');

/**
 * Call handleCreation function with a newToken which doesn't already exist
 * @param {function(string)} handleCreation Function which handles the new token
 * @param {*} serviceRes result of the express service
 */
function createToken (serviceRes, handleCreation) {
    const newTokenValue = generateToken();
    Token.findOne({ value: newTokenValue }, (errToken, token) => {
        if (errToken) {
            throwInternalServerError(serviceRes);
        }
        else if (token) {
            createToken(serviceRes, handleCreation);
        }
        else {
            handleCreation (newTokenValue);
        }
    });
}

/**
 * Save an authentication tokens if given credentials correspond.
 * Required parameters:
 *  * body -> email (string), password (string)
 */
router.post("/tokens", (req, res) => {
    const user = {
        email: req.body.email,
        password: `${req.body.password}`
    };

    if (!user.email || !user.password) {
        res.status(statusCodes.BAD_REQUEST)
           .json({ success: false, message: "Missing email or password" });
    }
    else {
        User.findOne({ email: user.email, password: encrypt(user.password) }, function(err, user) {
            if (err) {
                throwInternalServerError(res);
            }
            else if (!user) {
                res.status(statusCodes.UNAUTHORIZED)
                   .json({ success: false, message: 'Invalid login or password.' });
            }
            else {
                createToken(res, (tokenValue) => {

                    const expiresAt = new Date ();

                    // one second in milliseconds
                    const oneSecond = 1000;

                    const newToken = new Token({
                        value: tokenValue,
                        expiresAt: new Date (expiresAt.getTime() + constants.TOKEN_DELAY * oneSecond)
                    });

                    newToken.save((tokenErr, token) => {
                        if (tokenErr) {
                            throwInternalServerError(res);
                        }
                        else {
                            User.update({ _id: user._id }, {
                                authToken: token._id
                            }, (userUpdateErr, userUpdated) => {
                                if (userUpdateErr || !userUpdated) {
                                    throwInternalServerError(res);
                                }
                                else {
                                    res
                                        .status(statusCodes.SUCCESS)
                                        .json({
                                            success: true,
                                            message: "SUCCESS",
                                            authToken: {
                                                value: token.value,
                                                expiresAt: token.expiresAt
                                            },
                                            user: user._id
                                        });
                                }
                            });
                        }
                    });

                });
            }
        });
    }
});

/**
 * TODO
 */
router.delete("/tokens", (req, res) => {
    // TODO implements
    res
        .status(statusCodes.BAD_REQUEST)
        .json({
            success: false,
            message: "Service not implemented"
        });
});

module.exports = router;
