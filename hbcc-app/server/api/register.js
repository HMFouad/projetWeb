var mongoose = require('./mongoose-connection');

module.exports.register=function(req,res){

    firstName=req.body.firstName;
    lastName=req.body.lastName;
    password=req.body.password;
    rpassword=req.body.rpassword;
    email=req.body.email;
    //speciality=req.body.speciality;

if (password == rpassword){
    
mongoose.users.insert( { firstName: firstName, lastName: lastName, password: password, email: email, speciality: "Master 2 Génie Logiciel" } );
}
else{
    console.log("password not match!!!");
  }
}
