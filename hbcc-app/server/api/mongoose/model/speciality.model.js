const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const specialitySchema = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('specialities', specialitySchema);
