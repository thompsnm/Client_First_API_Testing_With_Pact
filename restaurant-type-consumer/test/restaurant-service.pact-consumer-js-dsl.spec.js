var request = require('superagent');
var chai = require('chai');
var expect = chai.expect;

describe("pact-consumer-js-dsl", function() {
  var client, helloProvider;
  var Pact = require('../bower_components/pact-consumer-js-dsl/dist/pact-consumer-js-dsl.js')

  before(function() {
    //ProviderClient is the class you have written to make the HTTP calls to the provider
    //client = new ProviderClient('http://localhost:1234');
    helloProvider = Pact.mockService({
      consumer: 'Hello Consumer',
      provider: 'Hello Provider',
      port: 1234,
      dir: 'pacts',
      done: function (error) {
        expect(error).to.equal(null);
      }
    });

    // This ensures your pact-mock-service is in a clean state before
    // running your test suite.
    helloProvider.resetSession();
  });

  it("should say hello", function(done) {
    helloProvider
      .given("an alligator with the name Mary exists")
      .uponReceiving("a request for an alligator")
      .withRequest("get", "/alligators/Mary")
      .willRespondWith(200, {
        "Content-Type": "application/json"
      }, {
        "name": "Mary"
      });

    helloProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/alligators/Mary')
        .end(function(err, res){
          console.log(res.body);
          runComplete();
        });
    });
  });
});
