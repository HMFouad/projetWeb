const mongoose = require('mongoose');

var specialitySchema = new Schema({
    name: String,
    url: String
});

var Speciality = mongoose.model('specialities', specialitySchema);

var userSchema = new Schema({
  firstName:  String,
  lastName: String,
  password: String,
  email:   String,
  speciality: Speciality,
  authToken: {token : String, expiresAt:Date}
  }
);

var User = mongoose.model('users', userSchema);

var eventSchema = new Schema({
    title:  String,
    location: String,
    beginDate: Date,
    endDate:   Date
    }
  );

var Event = mongoose.model('events', eventSchema);

module.exports = {
    Speciality: Speciality,
    User: User,
    Event: Event
};