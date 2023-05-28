import { RequestHandler } from 'express';
import status from 'http-status';
import Token, { TokenDocument, IToken } from '@nifty/server-lib/models/token';
import RefreshToken from '@nifty/server-lib/models/refresh-token';
import { IUser } from '@nifty/server-lib/models/user';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants';

export default function auth() {
  const authHandler: RequestHandler = async (req, res, next) => {
    if (req.cookies[ACCESS_TOKEN_NAME] && req.cookies[REFRESH_TOKEN_NAME]) {
      // Fetch relevant token
      const accessToken = (await Token.findById(req.cookies[ACCESS_TOKEN_NAME]).populate<{ user: IUser }>(
        'user'
      )) as IToken & TokenDocument & { user: IUser };

      if (accessToken && accessToken.expires_at > new Date() && !accessToken.deleted_at) {
        // Set locals
        res.locals.user = accessToken.user;
        return next();
      }

      // refresh logic
      const refreshToken = await RefreshToken.findById(req.cookies[REFRESH_TOKEN_NAME]);
      if (!refreshToken || refreshToken.deleted_at) {
        res.clearCookie(ACCESS_TOKEN_NAME);
        res.clearCookie(REFRESH_TOKEN_NAME);
        return res.status(status.UNAUTHORIZED).json({ error: { message: 'Invalid authorization token.', type: 'invalid_request_error' } });
      }

      if (refreshToken && refreshToken.expires_at < new Date()) {
        res.clearCookie(ACCESS_TOKEN_NAME);
        res.clearCookie(REFRESH_TOKEN_NAME);
        return res.status(status.UNAUTHORIZED).json({ error: { message: 'Your session has expired. Please login again.', type: 'invalid_request_error' } });
      }

      const newAccessToken = await refreshToken.createAccessToken();
      res.cookie(ACCESS_TOKEN_NAME, newAccessToken.id, {
        maxAge: newAccessToken.expires_at.getTime() - Date.now(),
        path: '/',
        httpOnly: true,
      });

      res.locals.user = newAccessToken.user;
      return next();

    } else {
      // user is not logged in
      return res.status(status.UNAUTHORIZED).json({ error: { message: 'You are not logged in.', type: 'invalid_request_error' } });
    }
  };

  return authHandler;
}
