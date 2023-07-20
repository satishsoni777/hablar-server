import chai from 'chai';
// import chaiHttp from 'chai-http';
import app from '../server.js';
// Use the "should" assertion style
chai.should();

// test/test_api.js

// Configure chai
// chai.use(chaiHttp);

// Write the test
describe('GET testServer', () => {
    it('should return status 200 and a JSON object', (done) => {
        server
            .request(app)
            .get('/testServer')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').equal('Hello, world!');
                done();
            });
    });
});