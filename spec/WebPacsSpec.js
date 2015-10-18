var request = require("request");
// Set Timout to 1000ms
jasmine.getEnv().defaultTimeoutInterval = 1000;
// var serverurl = 'https://dicomwebpacs-tetraib-1.c9.io/';
var serverurl = 'http://localhost/';


describe('WebPacs-API', function() {
    describe('GET /', function() {
        it('should respond with : 200', function(done) {
            request.get(serverurl, function(error, response, body) {
                expect(response.statusCode).toEqual(200);
                done();
            });
        });
        it('should respond with : Running smoothly...', function(done) {
            request.get(serverurl, function(error, response, body) {
                expect(body).toEqual('Running smoothly...');
                done();
            });
        });
    });
});