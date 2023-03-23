import express from 'express';
import apiKeys from './api-keys';
import auth from './auth';
import files from './files';

const router = express.Router();

router.use('/auth', auth);
// router.use('/files', files);
// router.use('/apikeys', apiKeys);

export default router;
