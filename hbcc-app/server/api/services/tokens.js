const express = require('express');
const router = express.Router();
const User = require('../mongoose/model/user.model');
const statuscode = require('../../status-code');
const token = require('../mongoose/model/token.model')
const tokendelay = require('../token_config');
const secretcode = require('../secret_code');
const jwt = require('jsonwebtoken');

function checkToken(user, token){
    User.findOne({authtoken:token},function(err,token){
        token.value = jwt.sign(user[0],secretcode);
        token.expiresAt = tokendelay;
        checkToken(token,user);
    });
    return token;
}
// Sign in service
router.post('/tokens',(req,res)=>{
    console.log ("Service POST /tokens");
    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    if(user.email === null || user.password === null) {
        res.status(statuscode.BAD_REQUEST).json({success:false,message:"Missing email or password"});
    }
    else
    {
        User.findOne({ email: user.email, password: user.password },function(err, user){
            if (err || !user) {
                res.status(statuscode.UNAUTHORIZED).json({success:false,message:"Invalid login or password"});
            }
            const token = new token();
            token.value = jwt.sign(user[0],secretcode);
            token.expiresAt = tokendelay;
            checkToken(token,user);
            user.authtoken = token;      
            res.status(statuscode.SUCCESS).json({success:true,message:"SUCCESS"});

         });
        }
});

// Sign in service
router.delete('/tokens', (req, res) => {
});

module.exports = router;
