import { RedisClientType as RedisType, createClient, RedisModules, RedisFunctions, RedisScripts } from 'redis'

export type RedisClientType = RedisType<RedisModules, RedisFunctions, RedisScripts>

export function initRedisClient(): RedisClientType {
  const client = createClient({
    url: process.env.REDIS_HOST || 'redis://127.0.0.1:6379',
  });

  (async () => {
    // Connect to redis server
    await client.connect();
  })();

  client.on('error', (err) => {
    console.log('Redis error: ', err);
  });

  client.on('end', () => {
    console.log('Redis client connection closed');
  });

  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('ready', () => {
    console.log('Redis client ready');
  });

  return client
}
