import express from 'express';
// import storage from '@nifty/api/storage';
// import status from 'http-status';
//
// const router = express.Router();
//
// router.post('/', async (req, res, next) => {
//   try {
//     const { mimetype, originalname } = req.body;
//
//     if (!mimetype || !originalname) return res.sendStatus(status.BAD_REQUEST);
//
//     const [uploadUrl] = await storage
//       .file(`public/${originalname}`)
//       .getSignedUrl({
//         version: 'v4',
//         action: 'write',
//         expires: Date.now() + 5 * 60 * 1000,
//         contentType: mimetype,
//       });
//
//     res.send(uploadUrl);
//   } catch (err) {
//     next(err);
//   }
// });
//
// export default router;
