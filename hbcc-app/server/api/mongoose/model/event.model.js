const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title:  String,
    location: String,
    beginDate: Date,
    endDate:   Date
});

module.exports = mongoose.model('events', eventSchema);
