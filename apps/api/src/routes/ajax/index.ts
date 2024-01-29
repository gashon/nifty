import express from 'express';
import auth from './auth';

const router: express.IRouter = express.Router();

router.use('/auth', auth);

export default router;
