const request = require('supertest');
const should = require('should/as-function');

const routerServer = require('../../router');
const statusCodes = require('../../status-codes');

const getOneSpeciality = require ('../utils/get-one-speciality');
const tokenExists = require('../utils/token-exists');
const userExists = require('../utils/user-exists');

/**
 * Execute test on users controller/
 */
describe('Tests for users', () => {

    const apiPath = '/api';
    let counter = 0;

    /**
     * Tests of POST /users api route.
     */
    describe('POST /users', () => {
        const servicePath = `${apiPath}/users`;

        it('Successful request', (done) => {
            getOneSpeciality().then((speciality) => {
                const userToInsert = {
                    email: `test${++counter}@test.fr`,
                    password: 123,
                    firstName: "Bernard",
                    lastName: "Toc",
                    speciality: `${speciality._id}`
                };

                request(routerServer)
                    .post(servicePath)
                    .send(userToInsert)
                    //check status code
                    .expect(statusCodes.SUCCESS)
                    // check presence
                    .end((err, res) => {
                        should(res.body.success).be.ok();
                        should(res.body.user).be.a.String();
                        should(res.body.authToken).be.a.Object();
                        should(res.body.authToken.value).be.a.String();
                        should(res.body.authToken.expiresAt).be.a.String();

                        let tokenIsExisting = false;
                        let userIsExisting = false;

                        tokenExists(
                            res.body.authToken.value,
                            res.body.authToken.expiresAt
                        ).then(() => {
                            tokenIsExisting = true;
                            if (tokenIsExisting && userIsExisting) {
                                done();
                            }
                        });

                        userExists(res.body.user).then((user) => {
                            should(user.email).be.exactly(userToInsert.email);
                            should(user.firstName).be.exactly(userToInsert.firstName);
                            should(user.lastName).be.exactly(userToInsert.lastName);
                            should(user.speciality.toString()).be.exactly(userToInsert.speciality);

                            userIsExisting = true;
                            if (tokenIsExisting && userIsExisting) {
                                done();
                            }
                        });
                    });
            });
        });

        it('Bad request (email already exists)', (done) => {
            getOneSpeciality().then((speciality) => {
                const userToInsert = {
                    email: `test${++counter}@test.fr`,
                    password: 123,
                    firstName: "Bernard",
                    lastName: "Toc",
                    speciality: `${speciality._id}`
                };

                request(routerServer)
                    .post(servicePath)
                    .send(userToInsert)
                    //check status code
                    .expect(statusCodes.SUCCESS)
                    // check presence
                    .end((err, res) => {
                        request(routerServer)
                            .post(servicePath)
                            .send(userToInsert)
                            //check status code
                            .expect(statusCodes.BAD_REQUEST)
                            // check presence
                            .end(() => {
                                done();
                            });
                    });
            });
        });

        it('Bad request (invalid email)', (done) => {
            getOneSpeciality().then((speciality) => {
                const userToInsert = {
                    email: `test${++counter}`,
                    password: 123,
                    firstName: "TEST 2",
                    lastName: "Toc",
                    speciality: `${speciality._id}`
                };

                request(routerServer)
                    .post(servicePath)
                    .send(userToInsert)
                    //check status code
                    .expect(statusCodes.BAD_REQUEST)
                    // check presence
                    .end(() => {
                        done();
                    });
            });
        });
        it('Bad request (unknown speciality)', (done) => {
            const userToInsert = {
                email: `test${++counter}`,
                password: 123,
                firstName: "TEST 2",
                lastName: "Toc",
                speciality: `C'est une specialité invalide`
            };

            request(routerServer)
                .post(servicePath)
                .send(userToInsert)
                //check status code
                .expect(statusCodes.BAD_REQUEST)
                // check presence
                .end(() => {
                    done();
                });
        });
        it('Bad request (params missing)', (done) => {
            const userToInsert = {
                email: `test${++counter}@test.fr`,
                password: 123,
                firstName: "TEST",
            };

            request(routerServer)
                .post(servicePath)
                .send(userToInsert)
                //check status code
                .expect(statusCodes.BAD_REQUEST)
                // check presence
                .end(() => {
                    done();
                });
        });
    });

});
