import basicAuth from 'basic-auth';
import { RequestHandler } from 'express';
import status from 'http-status';
import Token from 'lib/models/token';
import RefreshToken from 'lib/models/refresh-token';
import { IUser } from 'lib/models/user';

export default function auth() {
  const authHandler: RequestHandler = async (req, res, next) => {
    if (req.cookies.access_token && req.cookies.refresh_token) {
      // Fetch relevant token
      const accessToken = await Token.findById(req.cookies.access_token).populate<{ user: IUser }>(
        'user'
      );

      // Reject if authorization token not found
      if (!accessToken) return res.sendStatus(status.UNAUTHORIZED);

      if (accessToken.expires_at && accessToken.expires_at < new Date()) {
        // grab and check refresh token
        const refreshToken = await RefreshToken.findById(req.cookies.refresh_token);
        if (!refreshToken || refreshToken.expires_at < new Date()) {
          if (refreshToken) await refreshToken.deleteOne();
          await accessToken.deleteOne();

          return res.sendStatus(status.UNAUTHORIZED);
        }

        const newAccessToken = await refreshToken.createAccessToken();
        res.cookie('access_token', newAccessToken.id, {
          maxAge: newAccessToken.expires_at.getTime() - Date.now(),
          path: '/',
          httpOnly: true,
        });
      }

      // Set locals
      res.locals.user = accessToken.user;
      next();
    } else {
      return res.status(status.UNAUTHORIZED).send({
        error: {
          message: 'Missing authorization token',
          type: 'invalid_request_error',
        },
      });
    }

  };

  return authHandler;
}
