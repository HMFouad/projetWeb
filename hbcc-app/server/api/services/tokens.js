const express = require('express');
const router = express.Router();
const User = require('../mongoose/model/user.model');

// Sign in service
router.post('/',(req,res)=>{
    console.log ("Service POST /tokens");

    var user=new User();
    user.email=req.body.email;
    user.password=req.body.password;
    if(user.email==null || user.password==null){
        res.status(422).json({success:false,message:"Missing email or password"});
    }else{
        User.findOne({email:user.email,password:user.password},function(err,user){
            if (err) {

            }
            //var token= new Access_token();

        });
        res.status(200).json({success:true,message:"SUCCESS"});
    }
});

module.exports = router;
