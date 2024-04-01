import {
  RedisClientType as RedisType,
  createClient,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from 'redis';
import logger from '@nifty/api-live/lib/logger';

// export type RedisClientType = RedisType<RedisModules, RedisFunctions, RedisScripts>

export function initRedisClient() {
  const client = createClient({
    url: process.env.REDIS_HOST || 'redis://127.0.0.1:6379',
  });

  (async () => {
    // Connect to redis server
    await client.connect();
  })();

  client.on('error', (err) => {
    logger.error(`Redis client error: ${err}`);
  });

  client.on('end', () => {
    logger.info('Redis client disconnected');
  });

  client.on('connect', () => {
    logger.info('Redis client connected');
  });

  client.on('ready', () => {
    logger.info('Redis client ready');
  });

  return client;
}
