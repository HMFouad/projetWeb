const express = require('express');
const router = express.Router();
const usersRoutes = require('./services/users');

router.use('/users', usersRoutes);

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

/*// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});*/

router.post('/tokens',(req,res)=>{
    var user=new User();
    user.email=req.body.email;
    user.password=req.body.password;
    if(user.email==null || user.password==null){
        res.status(422).json({success:false,message:"Missing email or password"});
    }else{
        User.findOne({email:user.email,password:user.password},function(err,user){
            var token= new Access_token();
            
        });
    }
});

module.exports = router;
