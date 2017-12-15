const http = require('http');

const constants = require('./constants');
const router = require('./router');

const dbConnection = require('./mongoose/db-connection').connect;
const dbDisconnect = require('./mongoose/db-connection').disconnect;
const dbConfig = require('./mongoose/db-config').default;

const port = constants.HOST_PORT;

// load router
const server = http.createServer(router);

// launch server
server.listen(port, () => {
    console.log(`Running on localhost:${port}`);
    dbConnection(dbConfig)
        .then(() => console.log(`Database connection launched`),
              () => console.log(`Database connection failed`));
});

// disconnect on ^C
process.on('SIGINT', () => {
    dbDisconnect();
});
