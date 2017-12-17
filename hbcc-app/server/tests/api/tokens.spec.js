const request = require('supertest');
const should = require('should/as-function');

const routerServer = require('../../router');
const statusCodes = require('../../status-codes');

const getOneSpeciality = require ('../utils/get-one-speciality');
const tokenExists = require('../utils/token-exists');
const userExists = require('../utils/user-exists');


/**
 * Execute test on tokens controller.
 */
describe('Tests for tokens', () => {

    const apiPath = '/api';


    /**
     * Test of POST /tokens api route.
     */
    describe('POST /tokens', () => {
        const servicePath = `${apiPath}/tokens`;

        it('Successful request', (done) => {

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


                    const userToken = {
                        email: "test@test.fr",
                        password: 123
                    };

                    request(routerServer)
                        .post(servicePath)
                        .send(userToken)
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
            });


            });

            it('Bad request (param missing)', (done) => {
                const userToken = {
                    email: "test@test.fr",
                    password: 123
                };
                    request(routerServer)
                        .post(servicePath)
                        .send(userToken)
                        //check status code
                        .expect(statusCodes.BAD_REQUEST)
                        // check presence
                        .end(() => {
                            done();
                        });

            });

            it('Bad request (invalid param)', (done) => {
                const userToken = {
                    email: "test@test.fr",
                    password: `${123}`
                };

                    request(routerServer)
                        .post(servicePath)
                        .send(userToken)
                        //check status code
                        .expect(statusCodes.BAD_REQUEST)
                        // check presence
                        .end(() => {
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
                    const userToken = {
                        email: "test@test.fr",
                        password: 123
                    };
                    request(routerServer)
                        .post(`${apiPath}/users`)
                        .send(userToken)
                        //check status code
                        .expect(statusCodes.SUCCESS)
                        // check presence
                        .end((err, res) => {
                            request(routerServer)
                                .delete(servicePath)
                                .send(userToken)
                                //check status code
                                .expect(statusCodes.SUCCESS)
                                // check presence
                                .end(() => {
                                    done();
                            });
                        });


                });
            });


        });

    });
});





