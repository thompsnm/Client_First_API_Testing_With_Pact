var pact = require('@pact-foundation/pact-node');
var opts = {
    providerBaseUrl: 'http://127.0.0.1:10010',       // Running API provider host endpoint. Required.
    pactUrls: ['http://pactbroker-1.8de890fb.cont.dockerapp.io/pacts/provider/Restaurant%20Service/consumer/Restaurant%20Type%20Consumer/latest']               // Array of local Pact file paths or Pact Broker URLs (http based). Required.
};

console.log('Verifying pacts');

pact.verifyPacts(opts).then(function () {
    console.log('Pact verification is complete');
});
