import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import ajax from './ajax';
import v1 from './v1';

const router = express.Router();

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));
router.use(helmet());
router.use(cors());
router.use(cookieParser());

router.use('/v1', v1);
router.use('/ajax', ajax);

export default router;
