import { Request, Response, NextFunction } from 'express';
import { IUser } from '@nifty/server-lib/models/user';
import createLoginLink from '@nifty/api/util/create-login-link';
import { TokenStrategy } from '@nifty/common/types';
import { generateTokens } from '@nifty/api/util/create-tokens';

export default function oauthLogin(strategy: TokenStrategy) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = req.query.state && JSON.parse(req.query.state.toString());
      const user = req.user as IUser;
      if (!user) return res.redirect(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

      const {encodedAccessToken, encodedRefreshToken} = await generateTokens(user, {
        strategy,
        requestIp: req.ip,
        requestUserAgent: req.headers['user-agent'] || ''
      })

      const loginLink = createLoginLink({ encodedAccessToken, encodedRefreshToken}, state.redirect?.toString() || '/dashboard');

      res.redirect(loginLink.toString());
    } catch (err) {
      console.log("err", err)
      next(err);
    }
  };
}
