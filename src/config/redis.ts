

import { createClient } from 'redis';

const redisClient = createClient();


redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

const connectRedis = async (retries = 5, delay = 3000) => {
  try {
    await redisClient.connect();
    console.log(' Redis connected');
  } catch (error) {
    console.error(' Redis connection failed:', error);
    if (retries === 0) {
      console.error(' Max retries reached. Exiting...');
      process.exit(1); 
    } else {
      console.log(`Retrying connection... (${retries} retries left)`);
      setTimeout(() => connectRedis(retries - 1, delay), delay);
    }
  }
};

connectRedis();

export default redisClient;
