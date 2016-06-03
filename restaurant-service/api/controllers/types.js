'use strict';

var restaurants = require('../data/restaurants.json')

module.exports = {
  types: types
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function types(req, res) {
  var types = [];

  restaurants.forEach(function(restaurant) {
    var existingType = types.find(function(type) {
      return type === restaurant.type;
    });

    if (existingType === undefined) {
      types.push(restaurant.type);
    }
  });

  // this sends back a JSON response which is a single string
  res.json(types);
}
