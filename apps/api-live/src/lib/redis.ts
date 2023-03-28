import redis, { RedisClientOptions } from 'redis'
import { promisify } from "util"

const redisClient = redis.createClient({
  url: process.env.REDIS_HOST || null,
  port: process.env.REDIS_PORT || 6379
} as RedisClientOptions);

const redisGet = promisify(redisClient.get).bind(redisClient);
export { redisClient, redisGet };