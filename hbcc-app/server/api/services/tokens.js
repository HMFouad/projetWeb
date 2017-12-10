const express = require("express");
const router = express.Router();
const User = require("../mongoose/model/user.model");
const statuscode = require("../../status-code");
const Token = require("../mongoose/model/token.model");
const tokendelay = require("../token_config");
const secretcode = require("../secret_code");
const jwt = require("jsonwebtoken");
const mongoose = require ("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
/*const ObjectId = require ("mongoose").ObjectId; */

/**
 * @param {function(string)} handleCreation Function which handle the new token
 */
function createToken (handleCreation) {
    const newToken = jwt.sign('grr', secretcode.SECRET_CODE);
    User.findOne({ authtoken: { value: newToken } }, (err, user) => {
        if (err) {
            // TODO handle
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
            /*
            console.log(token.value);
            token.expiresAt = tokendelay;
            //checkToken(user, token);
            user.authtoken = token;*/

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
                        // TODO
                    }
                    else {
                        User.update({ _id: user._id }, {
                             $set: { authToken: token._id }
                        }, (userUpdateErr, userUpdated) => {
                            // TODO handle err

                            res.status(statuscode.SUCCESS)
                               .json({
                                   success: true,
                                   message: "SUCCESS",
                                   authtoken: user.authtoken,
                                   user: user._id,
                                   authToken: {
                                       value: token.value,
                                       expiresAt: token.expiresAt
                                   }
                               });
                        });
                    }
                });
            });
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
