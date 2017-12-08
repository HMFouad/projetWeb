const statuscode = require('../status-code');
const User = require('./mongoose/model/user.model');

module.exports = (req, res, success_handler) => {
    const token = req.token;
    User.findOne({ authToken: token }, (err, user) => {
        if (err) {
            res.status(statuscode.FORBIDDEN).json({ success: false, message: "Can't access" }); // changer statuscode
        }
        else {
            success_handler(user);
        }
    });
};
