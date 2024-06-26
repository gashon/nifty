import express from 'express';
import status from 'http-status';

import { db } from '@nifty/common/db';
import type { Selectable, User } from '@nifty/common/types';
import passport from '@nifty/api/lib/passport';
import createLoginLink from '@nifty/api/util/create-login-link';
import auth from '@nifty/api/middlewares/auth';
import oauthLogin from '@nifty/api/middlewares/oauth-login';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@nifty/api/constants';
import { generateAuthTokens } from '@nifty/api/util/create-tokens';

const router: express.IRouter = express.Router();

router.post('/login/email', async (req, res, next) => {
  try {
    let user = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', req.body.email)
      .executeTakeFirst();

    if (!user)
      user = await db
        .insertInto('user')
        .values({ email: req.body.email })
        .returningAll()
        .executeTakeFirstOrThrow();

    if (!user || user.deletedAt) return res.sendStatus(status.UNAUTHORIZED);

    const { encodedAccessToken, encodedRefreshToken } =
      await generateAuthTokens(user as Selectable<User>, {
        strategy: 'email',
        requestIp: req.ip,
        requestUserAgent: req.headers['user-agent'] || '',
      });

    // TODO - send email
    const loginLink = createLoginLink(
      { encodedAccessToken, encodedRefreshToken },
      '/dashboard'
    );

    // await Notification.create({
    //   type: 'login',
    //   emails: [req.body.email],
    //   data: { login_link: loginLink.toString() },
    // });

    res.sendStatus(status.OK);
  } catch (err) {
    console.log('err', err);
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
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.DASHBOARD_BASE_URL}/auth/login`,
  }),
  oauthLogin('google')
);

router.get('/user', auth(), async (req, res, next) => {
  try {
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', res.locals.user.id)
      .executeTakeFirst();

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  try {
    // @TODD (gashon) - blacklist token to prevent replay attacks

    res.clearCookie(ACCESS_TOKEN_NAME);
    res.clearCookie(REFRESH_TOKEN_NAME);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
