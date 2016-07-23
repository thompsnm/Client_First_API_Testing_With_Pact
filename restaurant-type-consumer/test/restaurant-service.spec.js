var path = require('path');
var wrapper = require('@pact-foundation/pact-node');
var Pact = require('pact');
var Q = require('q');
var request = require('superagent-promise')(require('superagent'), Q.Promise);
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect;

describe("Restaurant service", function() {
  var client, restaurantTypeProvider;

  var somethingLike = Pact.Matchers.somethingLike;
  var eachLike = Pact.Matchers.eachLike;

  this.timeout(10000);

  var pact = Pact({ consumer: 'Restaurant Type Consumer', provider: 'Restaurant Service' });

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

  after(function(done) {
    pact.finalize().then(function() {
      wrapper.removeAllServers();
      done();
    });
  });

  it("types endpoint", function(done) {
    pact.addInteraction({
      uponReceiving: "a request for all restaurant types",
      withRequest: {
        method: "get",
        path: "/types"
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          "types": eachLike(
            somethingLike("Italian")
          )
        }
      }
    }).then(function() {

      var verificationPromise = request
        .get('http://localhost:1234/types')
        .set({ 'Accept': 'application/json' })
        .then(pact.verify);

      expect(verificationPromise).to.eventually.equal(JSON.stringify({ types: ["Italian"] })).and.notify(done);
    });
  });

  it("type endpoint", function(done) {
    pact.addInteraction({
      uponReceiving: "a request for all restaurants of a type",
      withRequest: {
        method: "get",
        path: "/type",
        query: "type=Italian"
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          "names": eachLike(
            somethingLike("Gondolier")
          )
        }
      }
    }).then(function() {

      var verificationPromise = request
        .get('http://localhost:1234/type?type=Italian')
        .set({ 'Accept': 'application/json' })
        .then(pact.verify);

      expect(verificationPromise).to.eventually.equal(JSON.stringify({ names: ["Gondolier"] })).and.notify(done);
    });
  });

  it("restaurant endpoint", function(done) {
    pact.addInteraction({
      uponReceiving: "a request for information about a restaurant",
      withRequest: {
        method: "get",
        path: "/restaurant",
        query: "name=Gondolier"
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          "name": somethingLike("Gondolier"),
          "type": somethingLike("Italian")
        }
      }
    }).then(function() {

      var verificationPromise = request
        .get('http://localhost:1234/restaurant?name=Gondolier')
        .set({ 'Accept': 'application/json' })
        .then(pact.verify);

      expect(verificationPromise).to.eventually.equal(JSON.stringify({ name: "Gondolier", type: "Italian" })).and.notify(done);
    });
  });
});
