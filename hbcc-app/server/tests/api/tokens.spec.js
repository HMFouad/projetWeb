const routerServer = require('../../router');
const request = require('supertest');

/**
 * Execute test on tokens controller/
 */
describe('Tests for tokens', () => {

    const apiPath = '/api';

    /**
     * Test of POST /tokens api route.
     */
    describe('POST /tokens', () => {
        const servicePath = `${apiPath}/tokens`;

        it('Successful request', (done) => {
            request(routerServer)
                .post(servicePath)
                .end((err, res) => {
                    // TODO
                    done();
                });
        });
    });
});
