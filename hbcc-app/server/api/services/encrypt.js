
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
pass = 'd6F3Efeq';

//
exports.encrypt = function (text){
var cipher = crypto.createCipher(algorithm,pass)
var crypted = cipher.update(text,'utf8','hex')
crypted += cipher.final('hex');
return crypted;
}

exports.decrypt = function (text){
var decipher = crypto.createDecipher(algorithm,pass)
var dec = decipher.update(text,'hex','utf8')
dec += decipher.final('utf8');
return dec;
}
