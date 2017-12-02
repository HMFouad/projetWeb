const mongoose = require('mongoose');
const dbConfig = require('./config');

/**
 * Do the database connection and call the given handlerin if succeed
 * @param {function} closure Function which get the databse connection in params;
 * @return {*}
 */
module.exports = (closure) => {
    const queryConnection = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

    return mongoose.connect(queryConnection, (err, db) => {
        if (err) {
            return console.log(err);
        }

        // call given handler
        closure(db);
    });
};
