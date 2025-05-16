
const { createClient } = require('redis');
const client = createClient();
client.connect();

function subscribeToEvents(handler) {
  client.subscribe('user-events', (message) => {
    handler(message);
  });
}
module.exports = { subscribeToEvents };
