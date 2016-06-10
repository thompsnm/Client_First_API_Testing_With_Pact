# Client First API Testing With Pact

This project is intended to investigate and exemplify developing the API between multiple consumers / providers in a microservice based system.

## Building the project

All components of this project are built as part of a single [Travis CI job](https://travis-ci.org/thompsnm/Client_First_API_Testing_With_Pact) on every push to master. Ideally the subprojects would be built individually and any interdependency in jobs would be handled via webhooks, but that was out of scope for the current implementation.

In addition to Travis CI, this project relies on one other external resource. The Pact ecosystem utilizes a [Pact Broker](https://github.com/bethesque/pact_broker/wiki/Publishing-and-retrieving-pacts) in order to publish the contracts to. For this project, a [docker container](https://github.com/DiUS/pact_broker-docker) is deployed to [an AWS instance](http://pactbroker-1.8de890fb.cont.dockerapp.io/ui/relationships).

The full build process is as follows:

1. Build is initialized on a Node server
2. Ruby 2.2.2 is installed (Required for numerous Pact libraries while Node versions are being implemented)
3. Run pact tests in `restaurant-type-consumer`
    - This step also generates the associated pact for later consumption
4. Publish [the pact for this consumer](http://pactbroker-1.8de890fb.cont.dockerapp.io/pacts/provider/Restaurant%20Service/consumer/Restaurant%20Type%20Consumer/latest) to the broker
5. Run pact tests in `restaurant-rating-consumer`
    - This step also generates the associated pact for later consumption
6. Publish [the pact for this consumer](http://pactbroker-1.8de890fb.cont.dockerapp.io/pacts/provider/Restaurant%20Service/consumer/Restaurant%20Rating%20Consumer/latest) to the broker
7. Verify the published pacts against the `restaurant-service` specification

## Process for implementing the first consumer / provider pair

1. Implement the service contract using Swagger
2. Implement Pact tests for the client using a Pact mock service such as [pact-consumer-js-dsl](https://github.com/DiUS/pact-consumer-js-dsl)
3. Run Pact tests to generate the pact for this client
4. Publish the pact to a broker
5. Incorporate a Pact verifier such as [pact-provider-verifier](https://github.com/pact-foundation/pact-provider-verifier) into the service
6. Verify the pact against the service

**NOTE:** By using the Pact mock service and the Swagger mock service, this entire development and verification process can be done _without writing any controller code_

## Process for implementing a additional consumer of an existing provider

1. Implement Pact tests for the client using a Pact mock service such as [pact-consumer-js-dsl](https://github.com/DiUS/pact-consumer-js-dsl)
2. Run Pact tests to generate the pact for this client
3. Publish the pact to a broker
4. Add the new pact to the list of pacts verified against the consumer
5. Verify the pact against the service

**NOTE:** With the Pact verifier already in place on the service, adding a new pact should be as simple as adding another argument.

## Additional information on subprojects

...can be found in their individual READMEs.
