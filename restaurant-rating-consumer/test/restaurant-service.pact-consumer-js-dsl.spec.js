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

});
