const mongoose = require('mongoose');

let db;

/**
 * Make a database connection.
 * Set all default config for mongoose.
 *
 * @params {{
 *      username: string,
 *      password: string,
 *      host: string,
 *      port: string,
 *      name: string
 * }} dbConfig
 *
 * @return {MongooseThenable}
 */
function connect(dbConfig) {

    // Set default mongoose config
    mongoose.Promise = global.Promise;

    // set queru
    const queryConnection = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

    // do the connection
    return mongoose.connect(queryConnection, { useMongoClient: true });
}

/**
 * @return {MongooseThenable}
 */
function disconnect() {
    return mongoose.disconnect();
}

module.exports = {
    connect,
    disconnect
};
