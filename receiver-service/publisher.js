
const { createClient } = require('redis');
const client = createClient();
client.connect();
async function publish(message) {
  await client.publish('user-events', JSON.stringify(message));
}
module.exports = { publish };
