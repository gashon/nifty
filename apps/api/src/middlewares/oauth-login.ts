import { Request, Response, NextFunction } from 'express';
import { IUser } from '@nifty/server-lib/models/user';
import Token from '@nifty/server-lib/models/token';
import RefreshToken from '@nifty/server-lib/models/refresh-token';
import createLoginLink from '@/util/create-login-link';

export default function oauthLogin(strategy: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = req.query.state && JSON.parse(req.query.state.toString());
      const user = req.user as IUser;
      if (!user) return res.redirect(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

      const [accessToken, refreshToken] = await Promise.all([
        Token.create({ user: user.id, strategy }),
        RefreshToken.create({
          user: user.id,
          created_by_ip: req.ip, // todo add fingerprint here
        })
      ]);

      const loginLink = createLoginLink({ accessToken, refreshToken }, state.redirect?.toString() || '/dashboard');
      console.log('loginLink', loginLink.toString());

      res.redirect(loginLink.toString());
    } catch (err) {
      next(err);
    }
  };
}
