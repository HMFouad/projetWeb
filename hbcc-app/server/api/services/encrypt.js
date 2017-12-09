const crypto = require('crypto'),
algorithm = 'aes-256-ctr',
pass = 'd6F3Efeq';

exports.encrypt = function (text) {
const cipher = crypto.createCipher(algorithm, pass);
let crypted = cipher.update(text, 'utf8', 'hex');
crypted += cipher.final('hex');
return crypted;
};

exports.decrypt = function (text) {
const decipher = crypto.createDecipher(algorithm, pass);
let dec = decipher.update(text, 'hex', 'utf8');
dec += decipher.final('utf8');
return dec;
};
