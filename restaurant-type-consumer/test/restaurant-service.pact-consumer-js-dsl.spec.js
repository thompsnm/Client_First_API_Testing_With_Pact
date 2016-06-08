var request = require('superagent');
var chai = require('chai');
var expect = chai.expect;

describe("pact-consumer-js-dsl", function() {
  var client, restaurantTypeProvider;
  var Pact = require('../bower_components/pact-consumer-js-dsl/dist/pact-consumer-js-dsl.js')

  var somethingLike = Pact.Match.somethingLike;
  var eachLike = Pact.Match.eachLike;

  before(function() {
    //ProviderClient is the class you have written to make the HTTP calls to the provider
    //client = new ProviderClient('http://localhost:1234');
    restaurantTypeProvider = Pact.mockService({
      consumer: 'Restaurant Type Consumer',
      provider: 'Restaurant Service',
      port: 1234,
      done: function (error) {
        expect(error).to.equal(null);
      }
    });

    // This ensures your pact-mock-service is in a clean state before
    // running your test suite.
    restaurantTypeProvider.resetSession();
  });

  it("should say hello", function(done) {
    restaurantTypeProvider
      .given("a set of restaurant types exists")
      .uponReceiving("a request for all restaurant types")
      .withRequest("get", "/types")
      .willRespondWith(200, {
        "Content-Type": "application/json"
      }, {
        "type": ["Italian", "Comfort Food"]
      });

    restaurantTypeProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/types')
        .end(function(err, res){
          expect(res.body).to.deep.equal({
            "types": eachLike({
              type: somethingLike("Italian")
            })
          });
          runComplete();
        });
    });
  });
});
