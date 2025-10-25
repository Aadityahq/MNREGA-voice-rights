const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Redis Connected');
}).catch((err) => {
  console.error('Redis Connection Error:', err);
});

// Helper functions for caching
const setCache = async (key, data, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Redis Set Error:', error);
    return false;
  }
};

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis Get Error:', error);
    return null;
  }
};

module.exports = { redisClient, setCache, getCache };