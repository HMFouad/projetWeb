const express = require("express");
const router = express.Router();
const User = require("../mongoose/model/user.model");
const statuscode = require("../../status-code");
const Token = require("../mongoose/model/token.model");
const tokendelay = require("../token_config");
const secretcode = require("../secret_code");
const jwt = require("jsonwebtoken");

/**
 * @param {function(string)} handleCreation Function which handles the new token
 */
function createToken (handleCreation) {
    const newToken = jwt.sign('newToken', secretcode.SECRET_CODE);
    User.findOne({ authtoken: { value: newToken } }, (err, res, user) => {
        if (err) {
            res
            .status(statuscode.NOT_FOUND)
            .json({ success: false, message: "error" });
        }

        if (user) {
            createToken(handleCreation);
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
        // TODO encrypt password form mohammed file

        User.findOne({ email: user.email, password: user.password }, function(err, user) {
            if (err || !user) {
                res
                .status(statuscode.UNAUTHORIZED)
                .json({ success: false, message: "Invalid login or password" });
            }
            createToken((tokenValue) => {

                const expiresAt = new Date ();

                // one second in milliseconds
                const oneSecond = 1000;

                const newToken = new Token({
                    value: tokenValue,
                    expiresAt: new Date (expiresAt.getTime() + tokendelay.TOKEN_DELAY * oneSecond)
                });

                newToken.save((tokenErr, token) => {
                    if (tokenErr) {
                        res
                        .status(statuscode.NOT_FOUND)
                        .json({ success: false, message: "error" });
                    }
                    else {
                        console.log("on update le user");
                        User.update({ _id: user._id }, {
                             authToken: token._id
                        }, (userUpdateErr, userUpdated) => {
                            if (userUpdateErr) {
                                res
                                .status(statuscode.NOT_FOUND)
                                .json({ success: false, message: "error" });
                            }
                            console.log("catch");
                            console.log(user._id);
                            console.log(userUpdateErr);
                            console.log(userUpdated);
                        });
                    }
                });


                res
                    .status(statuscode.SUCCESS)
                    .json({
                        success: true,
                        message: "SUCCESS",
                        authtoken: user.authtoken,
                        user: user._id
                    });
            });
        });
    }
});

// Sign in service
router.delete("/tokens", (req, res) => {});

module.exports = router;
