import { RequestHandler } from 'express';
import status from 'http-status';

import { AccessTokenJwt, RefreshTokenJwt } from '@nifty/common/types';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@nifty/api/constants';
import { verifyToken } from '@nifty/api/lib/jwt';
import { timestampIsExpired } from '@nifty/api/util/timestamp';
import { generateAccessToken } from '@nifty/api/util/create-tokens';

export default function auth(): RequestHandler {
  const authHandler: RequestHandler = async (req, res, next) => {
    const encodedAccessToken = req.cookies[ACCESS_TOKEN_NAME];
    const encodedRefreshToken = req.cookies[REFRESH_TOKEN_NAME];

    if (!!encodedAccessToken && !!encodedRefreshToken) {

      const accessToken = verifyToken<AccessTokenJwt>(encodedAccessToken)
      // TODO(@gashon) revokation logic
      if(!timestampIsExpired(accessToken.expiresAt)) {
        // Set locals
        res.locals.user = accessToken.user;
        return next();
      }

      // user access token is expired

      const refreshToken = verifyToken<RefreshTokenJwt>(encodedRefreshToken);
      const isRefreshTokenValid = refreshToken && !timestampIsExpired(refreshToken.expiresAt);
      // TODO(@gashon) revokation logic
      const isRefreshTokenDeleted = false;

      if (!isRefreshTokenValid || isRefreshTokenDeleted) {
        res.clearCookie(ACCESS_TOKEN_NAME);
        res.clearCookie(REFRESH_TOKEN_NAME);
        return res.status(status.UNAUTHORIZED).json({
          error: {
            message: isRefreshTokenValid ? 'Your session has expired. Please login again.' : 'Invalid authorization token.',
            type: 'invalid_request_error',
          },
        });
      }

      // create new access token
      const {encoded: newAccessToken, expiresAt }= generateAccessToken(refreshToken.user, {
        strategy: refreshToken.strategy,
        requestIp: req.ip,
        requestUserAgent: req.headers['user-agent'] || '',
      });

      res.cookie(ACCESS_TOKEN_NAME, newAccessToken, {
        expires: expiresAt,
        path: '/',
        httpOnly: true,
      });

      res.locals.user = refreshToken.user;
      return next();
    } else {
      // user is not logged in
      return res.status(status.UNAUTHORIZED).json({
        error: {
          message: 'You are not logged in.',
          type: 'invalid_request_error',
        },
      });
    }
  };

  return authHandler;
}
