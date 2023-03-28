import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from '@nifty/server-lib/mongoose';

const port = parseInt(process.env.PORT!, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const app = express();
// mongoose.connect(process.env.DATABASE_URL!);

app.set('trust proxy', !dev);
app.disable('x-powered-by');

app.use(morgan(dev ? 'dev' : 'combined'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: dev ? Number.MAX_SAFE_INTEGER : 100, // limit each IP to x requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
}))

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`port listening on ${port}`);
});
