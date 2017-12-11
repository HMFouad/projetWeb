
const statuscode = require("../../status-code");

/**
 * Call the error 500 (internal server error)
 * @param {*} serverRes result of the express service
 */

function internalServerError(serverRes) {
    serverRes
    .status(statuscode.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Internal server error" });
}

module.exports = internalServerError;
