import express from 'express';
import status from 'http-status';

import Notification from 'lib/models/notification';
import Token from 'lib/models/token';
import RefreshToken from 'lib/models/refresh-token';
import User, { IUser } from 'lib/models/user';

import passport from '@/lib/passport';
import createLoginLink from '@/util/create-login-link'

const router = express.Router();

router.post('/login/email', async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({ email: req.body.email });

    const [accessToken, refreshToken, _] = await Promise.all([
      Token.create({ user: user.id, strategy: 'email' }),
      RefreshToken.create({
        user: user.id,
        created_by_ip: req.ip,
      }),
      User.findByIdAndUpdate(user.id, { last_login: Date.now() }),
    ]);

    const loginLink = createLoginLink({ accessToken, refreshToken }, '/d');
    await Notification.create({
      type: 'login',
      emails: [req.body.email],
      data: { login_link: loginLink.toString() },
    });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

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
  async (req, res, next) => {
    try {
      const state = req.query.state && JSON.parse(req.query.state.toString());
      const user = req.user as IUser;
      if (!user) return res.redirect(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

      const [accessToken, refreshToken, _] = await Promise.all([
        Token.create({ user: user.id, strategy: 'google' }),
        RefreshToken.create({
          user: user.id,
          created_by_ip: req.ip,
        }),
        User.findByIdAndUpdate(user.id, { last_login: Date.now() }),
      ]);

      const loginLink = createLoginLink({ accessToken, refreshToken }, state.redirect?.toString() || '/d');

      res.redirect(loginLink.toString());
    } catch (err) {
      next(err);
    }
  }
);

router.get('/user', async (req, res, next) => {
  try {
    const token = await Token.findById(req.cookies.access_token).populate('user');

    if (!token) return res.sendStatus(status.UNAUTHORIZED);

    res.send(token.user);
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  try {
    await Token.findByIdAndDelete(req.cookies.access_token);
    await RefreshToken.findByIdAndDelete(req.cookies.refresh_token);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
