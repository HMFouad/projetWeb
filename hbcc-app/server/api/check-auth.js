const statuscode = require('../status-code');
const User = require('./mongoose/model/user.model');
const Token = require('./mongoose/model/token.model');

module.exports = (req, res, success_handler) => {
    const token = req.token;
    Token.findOne({ value: token }, (err, token) => {
        User.findOne({ authToken: token._id }, (err, user) => {
            if (err) {
                res.status(statuscode.FORBIDDEN).json({ success: false, message: "Can't access" }); // changer statuscode
            }
            else {

                success_handler(user);
            }
        });
    })

};
