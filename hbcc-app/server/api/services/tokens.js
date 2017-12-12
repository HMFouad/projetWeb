const express = require("express");
const router = express.Router();
const User = require("../mongoose/model/user.model");
const statuscode = require("../../status-code");
const Token = require("../mongoose/model/token.model");
const tokendelay = require("../token_config");
const secretcode = require("../secret_code");
const jwt = require("jsonwebtoken");
const internalServerError = require("../utils/internal_server_error");
const encrypt = require("../utils/encrypt");

/**
 * Call handleCreation function with a newToken which doesn't already exist
 * @param {function(string)} handleCreation Function which handles the new token
 * @param {*} serviceRes result of the express service
 */
function createToken (serviceRes, handleCreation) {
    const newToken = jwt.sign(Math.random(), secretcode.SECRET_CODE);
    Token.findOne({ value: newToken }, (errToken, token) => {
        if (errToken) {
            internalServerError(serviceRes);
        }
        else if (token) {
            console.log('!!!!!!!!!!!!!!!!!');
            createToken(serviceRes, handleCreation);
        }
        else {
            handleCreation (newToken);
        }
    });
}

// Sign in service
router.post("/tokens", (req, res) => {
    console.log("Service POST /tokens");
    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    if (user.email === null || user.password === null) {
        res
            .status(statuscode.BAD_REQUEST)
            .json({ success: false, message: "Missing email or password" });
    }
    else {
        User.findOne({ email: user.email, password: encrypt(user.password) }, function(err, user) {
            if (err) {
                internalServerError(res);
            }
            else if (!user) {
                res
                .status(statuscode.UNAUTHORIZED)
                .json({ success: false, message: "Invalid login or password" });
            }
            else {
                createToken(res, (tokenValue) => {

                    const expiresAt = new Date ();

                    // one second in milliseconds
                    const oneSecond = 1000;

                    const newToken = new Token({
                        value: tokenValue,
                        expiresAt: new Date (expiresAt.getTime() + tokendelay.TOKEN_DELAY * oneSecond)
                    });

                    newToken.save((tokenErr, token) => {
                        console.log (token)
                        if (tokenErr) {
                            internalServerError(res);
                        }
                        else {
                            console.log("on update le user");
                            User.update({ _id: user._id }, {
                                authToken: token._id
                            }, (userUpdateErr, userUpdated) => {
                                if (userUpdateErr || !userUpdated) {
                                    internalServerError(res);
                                }
                                else {
                                    res
                                        .status(statuscode.SUCCESS)
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

// Sign in service
router.delete("/tokens", (req, res) => {
    // TODO implements
    res
        .status(statuscode.BAD_REQUEST)
        .json({
            success: false,
            message: "Service not implemented"
        });
});

module.exports = router;
