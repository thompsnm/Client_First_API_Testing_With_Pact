var path = require('path');
var wrapper = require('@pact-foundation/pact-node');
var Pact = require('pact');
var Q = require('q');
var request = require('superagent-promise')(require('superagent'), Q.Promise);
var chai = require('chai');
var expect = chai.expect;

describe("Restaurant service", function() {
  var client, restaurantTypeProvider;

  var somethingLike = Pact.Matcher.somethingLike;
  var eachLike = Pact.Matcher.eachLike;

  this.timeout(10000);

  var pact = Pact({ consumer: 'Restaurant Type Consumer', provider: 'Restaurant Service' })

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

  it("types endpoint", function(done) {
    pact
      .interaction()
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

    pact.verify(function() {
      return request
        .get('http://localhost:1234/types')
        .end(function(err, res){});
    }).then(function(res) {
      expect(JSON.parse(res)).to.deep.equal({ types: ["Italian"] });
      done();
    });
  });

  it("type endpoint", function(done) {
    pact
      .interaction()
      .uponReceiving("a request for all restaurants of a type")
      .withRequest(
        "get",
        "/type",
        {type: "Italian"}
      )
      .willRespondWith(200, {
        "Content-Type": "application/json"
      },
      {
        "names": eachLike(
          somethingLike("Gondolier")
        )
      });

    pact.verify(function() {
      return request
        .get('http://localhost:1234/type?type=Italian')
        .end(function(err, res){});
    }).then(function(res) {
      expect(JSON.parse(res)).to.deep.equal({ names: ["Gondolier"] });
      done();
    });
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
        "type": somethingLike("Italian")
      });

    pact.verify(function() {
      return request
        .get('http://localhost:1234/restaurant?name=Gondolier')
        .end(function(err, res){});
    }).then(function(res) {
      expect(JSON.parse(res)).to.deep.equal({ name: "Gondolier", type: "Italian" });
      done();
    });
  });
});
