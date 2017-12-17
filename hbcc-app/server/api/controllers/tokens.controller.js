const express = require("express");
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const User = require("../../mongoose/model/user.model");
const statusCodes = require("../../status-codes");
const Token = require("../../mongoose/model/token.model");
const constants = require("../../constants");
const checkAuth = require('../utils/check-auth');
const throwInternalServerError = require("../utils/throw-internal-server-error");
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
    const givenEmail = req.body.email;
    const givenPassword = `${req.body.password}`;

    if (!givenEmail || !givenPassword) {
        res.status(statusCodes.BAD_REQUEST)
           .json({ success: false, message: "L'email et le mot de passe sont requis." });
    }
    else {
        User.findOne({ email: givenEmail }, (errErr, user) => {
            if (errErr) {
                throwInternalServerError(res);
            }
            else if (!user) {
                res.status(statusCodes.BAD_REQUEST)
                    .json({
                        success: false,
                        message: `L'email et le mot de passe ne correspondent pas.`
                    });
            }
            else {
                bcrypt.compare(givenPassword, user.password, (errPassword, isRightPassword) => {
                    if (errPassword) {
                        throwInternalServerError(res);
                    }
                    else if (!isRightPassword) {
                        res.status(statusCodes.BAD_REQUEST)
                           .json({
                               success: false,
                               message: `L'email et le mot de passe ne correspondent pas.`
                           });
                    }
                    else {
                        createToken(res, (tokenValue) => {

                            const expiresAt = new Date();

                            // one second in milliseconds
                            const oneSecond = 1000;

                            const newToken = new Token({
                                value: tokenValue,
                                expiresAt: new Date(expiresAt.getTime() + constants.TOKEN_DELAY * oneSecond)
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
        }).catch(() => {
            // throw errer for password encryption
            throwInternalServerError(res);
        });
    }
});

/**
 * Logout service.
 * Delete the given token in the database.
 * The access token must be given in header Authorization field.
 */
router.delete("/tokens", (req, res) => {
    checkAuth(req)
        .then((user) => {
            Token.remove({ _id: user.authToken._id }, (err) => {
                if (err) {
                    throwInternalServerError(res);
                }
                else {
                    res.status(statusCodes.SUCCESS)
                        .json({ success: true, message: "SUCCESS" });
                }
            });
        })
        .catch((throwErr) => {
            throwErr(res);
        });
});

module.exports = router;
