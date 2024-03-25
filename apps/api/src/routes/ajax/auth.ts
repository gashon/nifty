import express from 'express';
import status from 'http-status';

import Notification from '@nifty/server-lib/models/notification';
import Token from '@nifty/server-lib/models/token';
import RefreshToken from '@nifty/server-lib/models/refresh-token';
import User, { IUser } from '@nifty/server-lib/models/user';

import { db } from "@nifty/db/lib";

import passport from '@/lib/passport';
import createLoginLink from '@/util/create-login-link';
import auth from '@/middlewares/auth';
import oauthLogin from '@/middlewares/oauth-login';
import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS, ACCESS_TOKEN_NAME, REFRESH_TOKEN_EXPIRATION_IN_SECONDS, REFRESH_TOKEN_NAME } from '@/constants';

const router: express.IRouter = express.Router();

router.post('/login/email', async (req, res, next) => {
  try {
    let user = await db.selectFrom("user").select("id").where("email", '=', req.body.email).executeTakeFirst();
    if (!user) user = await db.insertInto("user").values({ email: req.body.email }).executeTakeFirst();

    const [accessToken, refreshToken] = await Promise.all([
      db.insertInto("token").values({
        user_id: user.id,
        strategy: 'email',
        expiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION_IN_SECONDS * 1000)
      }).executeTakeFirst(),
      db.insertInto("refresh_token").values({
        user_id: user.id,
        created_by_user_agent: req.headers['user-agent'],
        created_by_ip: req.ip,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000)
      }).executeTakeFirst()
    ]);

    const loginLink = createLoginLink(
      { accessToken, refreshToken },
      '/dashboard'
    );

    // await Notification.create({
    //   type: 'login',
    //   emails: [req.body.email],
    //   data: { login_link: loginLink.toString() },
    // });

    res.sendStatus(status.OK);
  } catch (err) {
    console.log('err', err)
    next(err);
  }
});

router.get('/login/github', (req, res, next) => {
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
    state: JSON.stringify({
      redirect: req.query.redirect?.toString(),
    }),
  })(req, res, next);
});

router.get(
  '/login/github/callback',
  (req, res, next) => {
    next();
  },
  passport.authenticate('github', {
    // todo export to middleware and share in both routes
    session: false,
    failureRedirect: `${process.env.DASHBOARD_BASE_URL}/auth/login`,
  }),
  oauthLogin('github')
);

router.get('/login/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: false,
    state: JSON.stringify({
      redirect: req.query.redirect?.toString(),
    }),
  })(req, res, next);
});

router.get(
  '/login/google/callback',
  (req, res, next) => {
    next();
  },
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.DASHBOARD_BASE_URL}/auth/login`,
  }),
  oauthLogin('google')
);

router.get('/user', auth(), async (req, res, next) => {
  try {
    const token = await Token.findById(req.cookies[ACCESS_TOKEN_NAME]).populate(
      'user'
    );
    if (!token) return res.sendStatus(status.UNAUTHORIZED);

    res.send(token.user);
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  try {
    await Token.updateMany(
      {
        _id: {
          $in: [
            req.cookies[ACCESS_TOKEN_NAME],
            req.cookies[REFRESH_TOKEN_NAME],
          ],
        },
      },
      { deleted_at: new Date() }
    );

    res.clearCookie(ACCESS_TOKEN_NAME);
    res.clearCookie(REFRESH_TOKEN_NAME);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
