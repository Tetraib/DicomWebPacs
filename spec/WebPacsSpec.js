var request = require("request");
// Set Timout to 1000ms
jasmine.getEnv().defaultTimeoutInterval = 1000;

describe('WebPacs-API', function() {
    describe('GET /', function() {
        it('should respond with : 200', function(done) {
            request.get('https://dicomwebpacs-tetraib-1.c9.io/', function(error, response, body) {
                expect(response.statusCode).toEqual(200);
                done();
            });
        });
        it('should respond with : Running smoothly...', function(done) {
            request.get('https://dicomwebpacs-tetraib-1.c9.io/', function(error, response, body) {
                expect(body).toEqual('Running smoothly...');
                done();
            });
        });
    });
});