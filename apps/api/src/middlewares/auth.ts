import basicAuth from 'basic-auth';
import { RequestHandler } from 'express';
import status from 'http-status';
import Token, { TokenDocument, IToken } from '@nifty/server-lib/models/token';
import RefreshToken from '@nifty/server-lib/models/refresh-token';
import { IUser } from '@nifty/server-lib/models/user';

export default function auth() {
  const authHandler: RequestHandler = async (req, res, next) => {
    if (req.cookies?.access_token && req.cookies?.refresh_token) {
      // Fetch relevant token
      const accessToken = (await Token.findById(req.cookies.access_token).populate<{ user: IUser }>(
        'user'
      )) as IToken & TokenDocument & { user: IUser };

      if (accessToken && accessToken.expires_at > new Date() && !accessToken.deleted_at) {
        // Set locals
        res.locals.user = accessToken.user;
        return next();
      }

      // refresh logic
      const refreshToken = await RefreshToken.findById(req.cookies.refresh_token);
      if (!refreshToken || refreshToken.deleted_at) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(status.UNAUTHORIZED).json({ error: { message: 'Invalid authorization token.', type: 'invalid_request_error' } });
      }

      if (refreshToken && refreshToken.expires_at < new Date()) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(status.UNAUTHORIZED).json({ error: { message: 'Your session has expired. Please login again.', type: 'invalid_request_error' } });
      }

      const newAccessToken = await refreshToken.createAccessToken();
      res.cookie('access_token', newAccessToken.id, {
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
