const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: String,
    expiresAt: Date
});

module.exports = mongoose.model('tokens', tokenSchema);
