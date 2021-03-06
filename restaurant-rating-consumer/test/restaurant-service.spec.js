var path = require('path');
var wrapper = require('@pact-foundation/pact-node');
var Pact = require('pact');
var Q = require('q');
var request = require('superagent-promise')(require('superagent'), Q.Promise);
var chai = require('chai');
var expect = chai.expect;

describe("Restaurant service", function() {
  var client, restaurantTypeProvider, server;

  var somethingLike = Pact.Matcher.somethingLike;
  var eachLike = Pact.Matcher.eachLike;

  this.timeout(10000);

  var pact = Pact({ consumer: 'Restaurant Rating Consumer', provider: 'Restaurant Service' });

  var server = wrapper.createServer({
    port: 1234,
    log: path.resolve(process.cwd(), 'log', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2
  });

  before(function(done) {
    server.start().then(function() {
      done();
    });
  });

  after(function() {
    wrapper.removeAllServers();
  });

  it("restaurant endpoint", function(done) {
    pact
      .interaction()
      .uponReceiving("a request for information about a restaurant")
      .withRequest(
        "get",
        "/restaurant",
        {name: "Gondolier"}
      )
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "name": somethingLike("Gondolier"),
        "rating": somethingLike(5)
      });

    pact.verify(function() {
      return request
        .get('http://localhost:1234/restaurant?name=Gondolier')
        .end(function(err, res) {});
    }).then(function(res) {
      expect(JSON.parse(res)).to.deep.equal({ name: "Gondolier", rating: 5 });
      done();
    });
  });

  it("top rated endpoint", function(done) {
    pact
      .interaction()
      .uponReceiving("a request for the name of the top rated restaurant")
      .withRequest(
        "get",
        "/topRated"
      )
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "name": somethingLike("Gondolier"),
        "rating": somethingLike(5)
      });

    pact.verify(function() {
      return request
        .get('http://localhost:1234/topRated')
        .end(function(err, res){});
    }).then(function(res) {
      expect(JSON.parse(res)).to.deep.equal({ name: "Gondolier", rating: 5 });
      done();
    });
  });
});
