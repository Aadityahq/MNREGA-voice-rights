const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis Client Connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis Connected Successfully');
    });

    await redisClient.connect();
    await redisClient.ping();

    return redisClient;
  } catch (error) {
    console.error('❌ Redis Connection Error:', error.message);
    console.warn('⚠️  Continuing without Redis cache...');
    console.warn('💡 Start Redis: brew services start redis');
    return null;
  }
};

process.on('SIGINT', async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 Redis connection closed');
  }
});

module.exports = { connectRedis, getRedisClient: () => redisClient };
