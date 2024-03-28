import type { Request, Response, NextFunction } from 'express';

import createLoginLink from '@nifty/api/util/create-login-link';
import { generateAuthTokens } from '@nifty/api/util/create-tokens';
import type { User, TokenStrategy, Selectable } from '@nifty/common/types';

export default function oauthLogin(strategy: TokenStrategy) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = req.query.state && JSON.parse(req.query.state.toString());
      const user = req.user as Selectable<User> | undefined;
      if (!user)
        return res.redirect(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

      const { encodedAccessToken, encodedRefreshToken } =
        await generateAuthTokens(user, {
          strategy,
          requestIp: req.ip,
          requestUserAgent: req.headers['user-agent'] || '',
        });

      const loginLink = createLoginLink(
        { encodedAccessToken, encodedRefreshToken },
        state.redirect?.toString() || '/dashboard'
      );

      res.redirect(loginLink.toString());
    } catch (err) {
      console.log('err', err);
      next(err);
    }
  };
}
