import express from 'express';
import status from 'http-status';
import Notification from 'lib/models/notification';
import Token from 'lib/models/token';
import User, { IUser } from 'lib/models/user';
import passport from '../../lib/passport';

const router = express.Router();

router.post('/login/email', async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) user = await User.create({ email: req.body.email });

    const token = await Token.create({ user: user.id, strategy: 'email' });

    const loginLink = token.getLoginLink(req.query.redirect?.toString() || '/d');
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

      const token = await Token.create({ user: user.id, strategy: 'google' });

      const loginLink = new URL(`${process.env.DASHBOARD_BASE_URL}/auth/login`);
      loginLink.searchParams.append('token', token.id);
      loginLink.searchParams.append(
        'redirect',
        encodeURIComponent(state.redirect?.toString() || '/query')
      );

      res.redirect(loginLink.toString());
    } catch (err) {
      next(err);
    }
  }
);

router.post('/recycle', async (req, res, next) => {
  try {
    const oldToken = await Token.findById(req.body.authorization);
    if (!oldToken) return res.sendStatus(status.UNAUTHORIZED);

    const newToken = await Token.create({
      user: oldToken.user,
      strategy: oldToken.strategy,
    });

    await User.findByIdAndUpdate(oldToken.user, { last_login: Date.now() });
    await oldToken.deleteOne();

    res.send({ authorization: newToken.id });
  } catch (err) {
    next(err);
  }
});

router.get('/user', async (req, res, next) => {
  try {
    const token = await Token.findById(req.cookies.authorization).populate('user');

    if (!token) return res.sendStatus(status.UNAUTHORIZED);

    res.send(token.user);
  } catch (err) {
    next(err);
  }
});

export default router;
