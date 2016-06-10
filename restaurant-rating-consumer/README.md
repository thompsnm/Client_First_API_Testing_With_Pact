# Restaurant Rating Consumer

A consumer of the `restaurant-service` that is only interested in restaurants and their ratings.

## Running the Pact tests

In order to run the Pact tests and generate the appropriate pact for publication, simply run:

    $ npm test

This npm script will handle installing _all_ dependencies, initialize a Pact mock server, run the tests, and write the associated pacts to `tmp/pacts`.

## Publishing the pacts

To publish the pacts to [the broker](http://pactbroker-1.8de890fb.cont.dockerapp.io/ui/relationships), simply run:

    $ npm run prublish-pacts
