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

  it("types endpoint", function(done) {
    restaurantTypeProvider
      .uponReceiving("a request for all restaurant types")
      .withRequest("get", "/types")
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "types": eachLike(
          somethingLike("Italian")
        )
      });

    restaurantTypeProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/types')
        .end(function(err, res){
          expect(res.body).to.deep.equal({ types: ["Italian"] });
          runComplete();
        });
    });
  });

  it("type endpoint", function(done) {
    restaurantTypeProvider
      .uponReceiving("a request for all restaurants of a type")
      .withRequest({
        method: "get",
        path: "/type",
        query: {type: "Italian"}
      })
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "names": eachLike(
          somethingLike("Gondolier")
        )
      });

    restaurantTypeProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/type?type=Italian')
        .end(function(err, res){
          expect(res.body).to.deep.equal({ names: ["Gondolier"] });
          runComplete();
        });
    });
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
        "type": somethingLike("Italian")
      });

    restaurantTypeProvider.run(done, function(runComplete) {
      request
        .get('http://localhost:1234/restaurant?name=Gondolier')
        .end(function(err, res){
          expect(res.body).to.deep.equal({ name: "Gondolier", type: "Italian" });
          runComplete();
        });
    });
  });
});
