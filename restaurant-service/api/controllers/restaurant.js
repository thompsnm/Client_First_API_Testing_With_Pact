'use strict';

var restaurants = require('../data/restaurants.json')

module.exports = {
  restaurant: restaurant
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function restaurant(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value;

  var filteredRestaurant = restaurants.find(function(restaurant) {
    if (restaurant.name === name) {
      return restaurant;
    }
  });

  // this sends back a JSON response which is a single string
  res.json(filteredRestaurant);
}
