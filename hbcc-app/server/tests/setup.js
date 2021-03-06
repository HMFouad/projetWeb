const dbConfig = require ('../mongoose/db-config').test;
const dbConnect = require ('../mongoose/db-connection').connect;
const dbDisconnect = require ('../mongoose/db-connection').disconnect;

const dropDatabase = require ('./utils/drop-database');
const resetSpecialities = require('../mongoose/reset-functions/reset-specialities');

/**
 * Do the database connection before all tests.
 */
before((done) => {
    dbConnect(dbConfig)
        .then(() => done());
});

/**
 * For each test, wipe all data from db.
 */
beforeEach((done) => {
    dropDatabase(done)
        .then(() => {
            resetSpecialities().then(() => {
                done();
            });
        });
});

/**
 * Disconnect from the database.
 */
after ((done) => {
    dbDisconnect()
        .then(() => done());
});
