'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

describe('/types', function() {
  describe('get', function() {
    it('should respond with 200 Success', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "types"
        ],
        "properties": {
          "types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      };

      /*eslint-enable*/
      api.get('/types')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(["Mexican","Pizza","Indian"])
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
