import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'lib/mongoose';
import morgan from 'morgan';
import throng from 'throng';
import earlyAccessGuard from './middleware/early-access-gaurd';
import errorHandler from './middleware/error-handler';
import indexRouter from './routes/index';

const port = parseInt(process.env.PORT!, 10) || 7000;
const dev = process.env.NODE_ENV !== 'production';

async function start() {
  // Connect to MongoDB
  await mongoose.connect(process.env.DATABASE_URL!);

  const app = express();

  app.set('trust proxy', !dev);
  app.disable('x-powered-by');

  app.use(morgan(dev ? 'dev' : 'combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(earlyAccessGuard);

  app.use('/', indexRouter);
  app.use(errorHandler);

  app.listen(port, () => console.log('Listening on port', port));
}

throng({
  worker: start,
  count: parseInt(process.env.WEB_CONCURRENCY!, 10) || 1,
  lifetime: Infinity,
});
