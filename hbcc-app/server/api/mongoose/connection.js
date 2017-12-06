const mongoose = require('mongoose');
const dbConfig = require('./config');

/**
 * Do the database connection and call the given handlerin if succeed
 * @return {*}
 */
module.exports = () => {
    const queryConnection = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

    mongoose
        .connect(queryConnection, { useMongoClient: true })
        .then (() => console.log('Database connection launched')) // success
        .catch(() => console.log('Database connection failed')); // error
};
