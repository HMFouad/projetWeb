const request = require('supertest');
const should = require('should/as-function');

const routerServer = require('../../router');
const statusCodes = require('../../status-codes');

const getOneSpeciality = require('../utils/get-one-speciality');
const tokenExists = require('../utils/token-exists');
const userExists = require('../utils/user-exists');

const Token = require('../../mongoose/model/token.model');


/**
 * Execute test on tokens controller.
 */
describe('Tests for tokens', () => {

    const apiPath = '/api';

    beforeEach((done) => {
        getOneSpeciality().then((speciality) => {
            const userToInsert = {
                email: `test@test.fr`,
                password: 123,
                firstName: "Bernard",
                lastName: "Toc",
                speciality: `${speciality._id}`
            };
            request(routerServer)
                .post(`${apiPath}/users`)
                .send(userToInsert)
                .end(() => {
                    done();
                });
        });
    });


    /**
     * Test of POST /tokens api route.
     */
    describe('POST /tokens', () => {
        const servicePath = `${apiPath}/tokens`;

        it('Successful request', (done) => {
            const userToken = {
                email: "test@test.fr",
                password: 123
            };

            request(routerServer)
                .post(servicePath)
                .send(userToken)
                // check presence
                .end((err, res) => {
                    should(res.status).be.exactly(statusCodes.SUCCESS);
                    should(res.body.success).be.ok();
                    should(res.body.user).be.a.String();
                    should(res.body.authToken).be.a.Object();
                    should(res.body.authToken.value).be.a.String();
                    should(res.body.authToken.expiresAt).be.a.String();

                    let tokenIsExisting = false;
                    let userIsExisting = false;

                    userExists(res.body.user).then((user) => {
                        should(user.email).be.exactly(userToken.email);
                        userIsExisting = true;
                        if (userIsExisting && tokenIsExisting) {
                            done();
                        }
                    });

                    tokenExists(res.body.authToken.value, res.body.authToken.expiresAt).then(() => {
                        tokenIsExisting = true;
                        if (userIsExisting && tokenIsExisting) {
                            done();
                        }
                    });
                });
        });

        it('Bad request (param missing)', (done) => {
            const userToken = {
                email: "test@test.fr"
            };
            request(routerServer)
                .post(servicePath)
                .send(userToken)
                // check presence
                .end((err, res) => {
                    should(res.status).be.exactly(statusCodes.BAD_REQUEST);
                    done();
                });

        });

        it('Bad request (invalid param)', (done) => {
            const userToken = {
                email: "testtresbeau@test45.fr",
                password: '12545643'
            };

            request(routerServer)
                .post(servicePath)
                .send(userToken)
                // check presence
                .end((err, res) => {
                    should(res.status).be.exactly(statusCodes.BAD_REQUEST);
                    done();
                });

        });
    });

    /**
     * Test of DELETE /tokens api route.
     */
    describe('DELETE /tokens', () => {
        const servicePath = `${apiPath}/tokens`;

        it('Successful request', (done) => {
            const userToken = {
                email: "test@test.fr",
                password: 123
            };
            request(routerServer)
                .post(`${apiPath}/tokens`)
                .send(userToken)
                // check presence
                .end((err, res) => {
                    const tokenValue = res.body.authToken.value;
                    const tokenExpiration = res.body.authToken.expiresAt;

                    request(routerServer)
                        .delete(servicePath)
                        .set('Authorization', `Bearer ${tokenValue}`)
                        // check presence
                        .end((err, res) => {
                            should(res.status).be.exactly(statusCodes.SUCCESS);
                            // check if the token doesn't exist in database
                            tokenExists(tokenValue, tokenExpiration)
                                .catch(() => {
                                    done();
                                });
                        });
                });
        });

        it('Bad request (bad access token value)', (done) => {
            request(routerServer)
                .delete(servicePath)
                .set('Authorization', `Bearer 58746872dfsg`)
                // check presence
                .end((err, res) => {
                    should(res.status).be.exactly(statusCodes.UNAUTHORIZED);
                    done();
                });
        });

        it('Successful request', (done) => {
            const userToken = {
                email: "test@test.fr",
                password: 123
            };
            request(routerServer)
                .post(`${apiPath}/tokens`)
                .send(userToken)
                // check presence
                .end((err, res) => {
                    const tokenValue = res.body.authToken.value;
                    const tokenExpiration = res.body.authToken.expiresAt;

                    const fakeExpiration = new Date();
                    const fakeDelay = 5;
                    fakeExpiration.setDate(fakeExpiration.getDate() - fakeDelay);

                    // we change the expiration date of the token
                    Token.update({ value: res.body.authToken.value }, {
                        expiresAt: fakeExpiration.toISOString()
                    }, () => {
                        request(routerServer)
                            .delete(servicePath)
                            .set('Authorization', `Bearer ${tokenValue}`)
                            // check presence
                            .end((err, res) => {
                                should(res.status).be.exactly(statusCodes.UNAUTHORIZED);
                                // check if the token doesn't exist in database
                                tokenExists(tokenValue, tokenExpiration)
                                    .catch(() => {
                                        done();
                                    });
                            });
                    } );
                });
        });
    });
});
