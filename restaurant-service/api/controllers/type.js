'use strict';

var restaurants = require('../data/restaurants.json')

module.exports = {
  type: type
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function type(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var type = req.swagger.params.type.value;
  var filteredRestaurants = [];

  restaurants.forEach(function(restaurant) {
    if (restaurant.type === type) {
      filteredRestaurants.push(restaurant.name);
    }
  });

  // this sends back a JSON response which is a single string
  res.json(filteredRestaurants);
}
