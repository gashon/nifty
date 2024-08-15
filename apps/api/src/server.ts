import dotenv from 'dotenv';

dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';

import earlyAccessGuard from './middlewares/guards/early-access';
import errorHandler from './middlewares/error-handler';
import indexRouter from './routes/index';
import { container } from './domains/inversify.config';
import logger from './lib/logger';

const port = parseInt(process.env.PORT!, 10) || 7000;
const dev = process.env.NODE_ENV !== 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: dev,
  enabled: !dev,
  tracesSampleRate: 0.5,
});

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.set('trust proxy', !dev);
  app.disable('x-powered-by');

  app.use(morgan(dev ? 'dev' : 'combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: dev ? Number.MAX_SAFE_INTEGER : 100, // limit each IP to x requests per windowMs
      message:
        'Too many requests from this IP, please try again after 15 minutes',
    })
  );

  // app.use(earlyAccessGuard);

  app.use('/', indexRouter);
});

server.setErrorConfig((app) => {
  app.use(errorHandler);
});

export async function start() {
  const serverInstance = server.build();
  serverInstance.listen(port, () =>
    logger.info(`Server started on port ${port}`)
  );
}

if (!module.parent) {
  start();
}
