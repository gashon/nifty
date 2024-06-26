import express from 'express';
import http from 'http';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import logger from '@nifty/api-live/lib/logger';

import { initRedisClient } from '@nifty/api-live/lib/redis';
import { WebSocketServer } from '@nifty/api-live/socket';

console.log('server listening on port 8080');

const port = 8080;
const dev = process.env.NODE_ENV !== 'production';

const app = express();

app.set('trust proxy', !dev);
app.disable('x-powered-by');

app.use(morgan(dev ? 'dev' : 'combined'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: dev ? Number.MAX_SAFE_INTEGER : 100, // limit each IP to x requests per windowMs
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  })
);

const redis = initRedisClient();

const server = http.createServer(app);
new WebSocketServer(redis, { server });

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
