const http = require('http');
const constants = require('./constants');
const router = require('./router');

const server = http.createServer(router);
const dbConnection = require('./mongoose/db-connection').connect;
const dbDisconnect = require('./mongoose/db-connection').disconnect;
const dbConfig = require('./mongoose/db-config').default;

const port = constants.HOST_PORT;

server.listen(port, () => {
    console.log(`Running on localhost:${port}`);
    dbConnection(dbConfig)
        .then(() => console.log(`Database connection launched`),
              () => console.log(`Database connection failed`));
});

process.on('SIGINT', () => {
    dbDisconnect();
});
