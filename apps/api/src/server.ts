import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import mongoose from '@nifty/server-lib/mongoose';

import earlyAccessGuard from './middleware/early-access-gaurd';
import errorHandler from './middleware/error-handler';
import indexRouter from './routes/index';
import { container } from './config/inversify.config';

// required for inversify-express-utils
import "./domains/directory/controller";

const port = parseInt(process.env.PORT!, 10) || 7000;
const dev = process.env.NODE_ENV !== 'production';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.set('trust proxy', !dev);
  app.disable('x-powered-by');

  app.use(morgan(dev ? 'dev' : 'combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // app.use(earlyAccessGuard);

  app.use('/', indexRouter);
  app.use(errorHandler);

});

server.setErrorConfig((app) => {
  app.use(errorHandler);
});

export async function start() {
  // Connect to MongoDB
  await mongoose.connect(process.env.DATABASE_URL!);

  const serverInstance = server.build();
  serverInstance.listen(port, () => console.log('Listening on port', port));
}

if (!module.parent) {
  start();
}
