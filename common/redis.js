const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: process.env.REDIS
});

client.on('connect', () => {
    console.log("client connected to redis .... ")
  })

// Check if there's an error in connecting to Redis
client.on('error', (err) => {
  console.log(`Error: ${err}`);
});

client.on('ready', () => {
    console.log('client connected to redis and ready to user')
})

client.on('end',() => {
     console.log("client disconnected from redis")
})

module.exports = client
