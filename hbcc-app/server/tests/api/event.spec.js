const request = require('supertest');
const should = require('should/as-function');

const routerServer = require('../../router');
const statusCodes = require('../../status-codes');

const getOneSpeciality = require ('../utils/get-one-speciality');
const tokenExists = require('../utils/token-exists');
const userExists = require('../utils/user-exists');
const eventExists = require('../utils/event-exists');

/**
 * Execute test on tokens controller/
 */
describe('Tests for events', () => {

    const apiPath = '/api';
    let counter = 0;

    /**
     * Tests of POST /tokens api route.
     */
    describe('POST /event', () => {
        const servicePath = `${apiPath}/event`;
        const addUserPath = `${apiPath}/user`;

        beforeEach(function () {
            getOneSpeciality().then((speciality) => {
                const userToInsert = {
                    email: `test${++counter}@test.fr`,
                    password: 123,
                    firstName: "Bernard",
                    lastName: "Toc",
                    speciality: `${speciality._id}`
                };

                request(routerServer)
                    .post(addUserPath)
                    .send(userToInsert);
            });
        });

        it('Successful request', (done) => {
                const eventToInsert = {
                    description: "Soutien de Maths",
                    location: "Ici",
                    start: new Date("2017-12-17T16:00:00"),
                    end: new Date("1995-12-17T18:00:00")}


                request(routerServer)
                    .post(servicePath)
                    .send(eventToInsert)
                    //check status code
                    .expect(statusCodes.SUCCESS)
                    // check presence
                    .end((err, res) => {
                        should(res.body.success).be.ok();

                        let eventIsExisting = false;

                        eventExists(
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



});
