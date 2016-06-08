var request = require('superagent');
var chai = require('chai');
var expect = chai.expect;

describe("Restaurant service", function() {
  var client, restaurantTypeProvider;
  var Pact = require('../bower_components/pact-consumer-js-dsl/dist/pact-consumer-js-dsl.js')

  var somethingLike = Pact.Match.somethingLike;
  var eachLike = Pact.Match.eachLike;

  before(function() {
    restaurantTypeProvider = Pact.mockService({
      consumer: 'Restaurant Rating Consumer',
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

  it("restaurant endpoint", function(done) {
    restaurantTypeProvider
      .uponReceiving("a request for information about a restaurant")
      .withRequest({
        method: "get",
        path: "/restaurant",
        query: {name: "Gondolier"}
      })
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "name": somethingLike("Gondolier"),
        "rating": somethingLike(5)
      });

    restaurantTypeProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/restaurant?name=Gondolier')
        .end(function(err, res){
          expect(res.body).to.deep.equal({ name: "Gondolier", rating: 5 });
          runComplete();
        });
    });
  });

  it("highest rated endpoint", function(done) {
    restaurantTypeProvider
      .uponReceiving("a request for the name of the highest rated restaurant")
      .withRequest({
        method: "get",
        path: "/restaurant"
      })
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "name": somethingLike("Gondolier"),
        "rating": somethingLike(5)
      });

    restaurantTypeProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/restaurant?name=Gondolier')
        .end(function(err, res){
          expect(res.body).to.deep.equal({ name: "Gondolier", rating: 5 });
          runComplete();
        });
    });
  });
});
