const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO Vérifier que les clés étrangère fonctionne
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    speciality: { type: Schema.Types.ObjectId, ref: 'specialities' },
    authToken: { type: Schema.Types.ObjectId, ref: 'tokens' }
});

module.exports = mongoose.model('users', userSchema);
