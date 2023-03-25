import express from 'express';
import auth from '../middleware/auth';

import directory from '../controllers/directory';
import subscribe from '../controllers/subscribe';

const router = express.Router();

router.post('/subscribe',
  (req, res, next) => {
    console.log("SUBSCRIBE", req.body)
    next()
  },
  subscribe.create)

router.post('/datasets', auth, directory.create);
// router.get('/datasets/:id', auth, directory.retrieve);
// router.patch('/datasets/:id', auth, directory.update);
// router.delete('/datasets/:id', auth, directory.delete);
// router.get('/datasets', auth, directory.list);

export default router;
