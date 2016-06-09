var pact = require('@pact-foundation/pact-node');

var opts = {
    pactUrls: ['./tmp/pacts'],               // Array of local Pact files or directories containing them. Required.
    pactBroker: 'http://pactbroker-1.8de890fb.cont.dockerapp.io',            // URL to fetch the provider states for the given provider API. Optional.
    consumerVersion: '1.0.5'
};

console.log('Attempting to publish pacts to ' + opts.pactBroker);

pact.publishPacts(opts).then(function () {
    console.log('Pacts have been published to ' + opts.pactBroker);
});
