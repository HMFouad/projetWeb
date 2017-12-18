const request = require('supertest');
const should = require('should/as-function');

const routerServer = require('../../router');
const statusCodes = require('../../status-codes');

const getOneSpeciality = require('../utils/get-one-speciality');
const eventExists = require('../utils/event-exists');

/**
 * Execute test on tokens controller/
 */
describe('Tests for events', () => {

    const apiPath = '/api';
    const addUserPath = `${apiPath}/users`;

    let authTokenValue;
    let userId;

    beforeEach(function (done) {
        getOneSpeciality().then((speciality) => {
            const userToInsert = {
                email: `test@test.fr`,
                password: 123,
                firstName: "Bernard",
                lastName: "Toc",
                speciality: `${speciality._id}`
            };
            request(routerServer)
                .post(addUserPath)
                .send(userToInsert)
                .expect(statusCodes.SUCCESS)
                .end((err, res) => {
                    userId = res.body.user;
                    authTokenValue = res.body.authToken.value;
                    done();
                });
        });
    });
    /**
     * Tests of POST /event api route.
     */
    describe('POST /events', () => {
        const servicePath = `${apiPath}/events`;

        it('Successful request', (done) => {
            const startDateToInsert = new Date("2017-12-17T16:00:00").toISOString();
            const endDateToInsert = new Date("2017-12-17T18:00:00").toISOString();
            const eventToInsert = {
                description: "Soutien de Maths",
                location: "Ici",
                start: startDateToInsert,
                end: endDateToInsert
            };


            request(routerServer)
                .post(servicePath)
                .set({Authorization: `Bearer ${authTokenValue}`})
                .send(eventToInsert)
                //check status code
                .expect(statusCodes.SUCCESS)
                // check presence
                .end((err, res) => {
                    should(res.body.success).be.ok();

                    eventExists(userId).then((event) => {
                        should(event.description).be.exactly(eventToInsert.description);
                        should(event.location).be.exactly(eventToInsert.location);

                        const startReceivedDate = new Date(event.start);
                        const endReceivedDate = new Date(event.end);

                        should(startReceivedDate.toISOString()).be.exactly(startDateToInsert);
                        should(endReceivedDate.toISOString()).be.exactly(endDateToInsert);

                        done();
                    });
                });
        });
    });
});
