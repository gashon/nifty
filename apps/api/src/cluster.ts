import throng from 'throng';
import { start } from './server';

const WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
  workers: WORKERS,
  lifetime: Infinity,
  grace: 5000,
  start: start,
});