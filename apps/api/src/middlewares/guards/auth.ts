import type { Request, Response, NextFunction } from 'express';
import status from 'http-status';

import { AccessTokenJwt, RefreshTokenJwt } from '@nifty/common/types';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@nifty/api/constants';
import { verifyToken } from '@nifty/api/lib/jwt';
import { timestampIsExpired } from '@nifty/api/util/timestamp';
import { generateAccessToken } from '@nifty/api/util/create-tokens';

export function authGuard() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const { isAuthenticated, user } = authenticateUser(req, res);

      if (isAuthenticated && user) {
        res.locals.user = user;
        return originalMethod.apply(this, [req, res, next]);
      }

      return res.status(status.UNAUTHORIZED).json({
        error: {
          message: 'You are not logged in.',
          type: 'invalid_request_error',
        },
      });
    };

    return descriptor;
  };
}

function authenticateUser(
  req: Request,
  res: Response
): { isAuthenticated: boolean; user?: AccessTokenJwt['user'] } {
  const encodedAccessToken = req.cookies[ACCESS_TOKEN_NAME];
  const encodedRefreshToken = req.cookies[REFRESH_TOKEN_NAME];

  if (!encodedAccessToken || !encodedRefreshToken)
    return { isAuthenticated: false };

  const accessToken = verifyToken<AccessTokenJwt>(encodedAccessToken);

  if (!timestampIsExpired(accessToken.expiresAt)) {
    return { isAuthenticated: true, user: accessToken.user };
  }

  const refreshToken = verifyToken<RefreshTokenJwt>(encodedRefreshToken);
  const isRefreshTokenValid =
    refreshToken && !timestampIsExpired(refreshToken.expiresAt);
  const isRefreshTokenDeleted = false; // TODO(@gashon) revocation logic

  if (!isRefreshTokenValid || isRefreshTokenDeleted) {
    res.clearCookie(ACCESS_TOKEN_NAME);
    res.clearCookie(REFRESH_TOKEN_NAME);
    return { isAuthenticated: false };
  }

  const { encoded: newAccessToken, expiresAt } = generateAccessToken(
    refreshToken.user,
    {
      strategy: refreshToken.strategy,
      requestIp: req.ip,
      requestUserAgent: req.headers['user-agent'] || '',
    }
  );

  res.cookie(ACCESS_TOKEN_NAME, newAccessToken, {
    expires: expiresAt,
    path: '/',
    httpOnly: true,
  });

  return { isAuthenticated: true, user: refreshToken.user };
}
