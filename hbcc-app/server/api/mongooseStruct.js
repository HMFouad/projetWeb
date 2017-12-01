const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialitySchema = new Schema({
    name: String,
    url: String
});

const tokenSchema = new Schema({
    token: String,
    expiresAt: Date
});

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    speciality: specialitySchema,
    authToken: tokenSchema
});

const eventSchema = new Schema({
    title:  String,
    location: String,
    beginDate: Date,
    endDate:   Date
});

module.exports = {
    Speciality: mongoose.model('specialities', specialitySchema),
    User: mongoose.model('users', userSchema),
    Event: mongoose.model('events', eventSchema)
};