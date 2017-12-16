/**
 * All config for the database connection.
 * @type {{ host: string, port: string, name: string, username: string, password: string }}
 */
module.exports = {
    default: {
        host: 'ds145230.mlab.com',
        port: '45230',
        name: 'hbcc_db',
        username: 'hbcc',
        password: 'hbcc2017'
    },
    test: {
        host: 'ds145230.mlab.com',
        port: '45230',
        name: 'hbcc_db',
        username: 'hbcc',
        password: 'hbcc2017'
    }
};
