# Restaurant Service

A service that provides endpoints that can be queried for information regarding the types and ratings of various restaurants.

## Setup

To install _all_ dependencies, simply run:

    $ npm run install-dependencies

## Verify consumer pacts

To verify pacts that have been published to [the broker](http://pactbroker-1.8de890fb.cont.dockerapp.io/ui/relationships), first start the Swagger mock service:

    $ npm run start-mock

Next, run the Pact verifier. The following script is set up to pull the pacts for the `restaurant-type-consumer` and `restaurant-rating-consumer` from the broker and verify them against the Swagger mock service:

    $ npm run verify-pacts

You may finally stop the Swagger mock service if you choose using the following script. **NOTE:** this script will stop _all_ Swagger processes:

    $ npm run stop-mock
