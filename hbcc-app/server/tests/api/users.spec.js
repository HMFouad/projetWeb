const request = require('supertest');
const should = require('should/as-function');

const routerServer = require('../../router');
const statusCodes = require('../../status-codes');

const getOneSpeciality = require ('../utils/get-one-speciality');
const tokenExists = require('../utils/token-exists');
const userExists = require('../utils/user-exists');

/**
 * Execute test on tokens controller/
 */
describe('Tests for users', () => {

    const apiPath = '/api';

    /**
     * Test of POST /tokens api route.
     */
    describe('POST /users', () => {
        const servicePath = `${apiPath}/users`;

        it('Test: successful request', (done) => {
            getOneSpeciality().then((speciality) => {
                request(routerServer)
                    .post(servicePath)
                    .send({
                        "email": "test@test.fr",
                        "password": 123,
                        "firstName": "Bernard",
                        "lastName": "Toc",
                        "speciality": `${speciality._id}`
                    })
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

                        userExists(res.body.user).then(() => {
                            userIsExisting = true;
                            if (tokenIsExisting && userIsExisting) {
                                done();
                            }
                        });
                    });
            });
        });
    });
});
