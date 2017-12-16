const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    description: String,
    location: String,
    start: Date,
    end: Date,
    userId: { type: Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('events', eventSchema);
