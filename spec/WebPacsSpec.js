var request = require("request");
// Set Timout to 1000ms
jasmine.getEnv().defaultTimeoutInterval = 1000;
var options = {
    url: 'http://localhost:8080',
    method: 'GET'
};
describe('WebPacs API', function() {
    describe('GET /', function() {
        it('should respond with : 200', function(done) {
            request(options, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
        it('should respond with : Running smoothly...', function(done) {
            request(options, function(error, response, body) {
                expect(body).toBe('Running smoothly...');
                done();
            });
        });
    });
});


