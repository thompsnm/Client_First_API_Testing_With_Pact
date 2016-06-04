'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

describe('/type', function() {
  describe('get', function() {
    it('should respond with 200 Success', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "names"
        ],
        "properties": {
          "names": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      };

      /*eslint-enable*/
      api.get('/type')
      .query({
        type: 'Mexican'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(['Efrains', 'The_Rio_Grande'])
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
