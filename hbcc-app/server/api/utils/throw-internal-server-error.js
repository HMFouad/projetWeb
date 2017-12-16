const statuscode = require("../../status-codes");

/**
 * Send the error 500 (internal server error), with the given result object.
 * @param {*} serverRes result of the express service
 */
function throwInternalServerError(serverRes) {
    serverRes
        .status(statuscode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
}

module.exports = throwInternalServerError;
