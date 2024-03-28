import { RequestHandler, Request, Response, NextFunction } from 'express';
import status from 'http-status';

import { USER_PERMISSIONS } from '@nifty/common/constants';
import { ACCESS_TOKEN_NAME } from '@nifty/api/constants';
import { verifyToken } from '@nifty/api/lib/jwt';
import type { AccessTokenJwt } from '@nifty/common/types';

const WHITE_LIST = ['/v1/users/subscribe'];

const earlyAccessGuard: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const path of WHITE_LIST) {
    if (req.url === path) {
      return next();
    }
  }

  const accessToken = verifyToken<AccessTokenJwt>(
    req.cookies[ACCESS_TOKEN_NAME]
  );

  // redirect to referrer if not early access
  if (!accessToken?.permissions?.includes(USER_PERMISSIONS.EARLY_ACCESS)) {
    if (req.url?.includes('ajax') && !req.url?.includes('email'))
      return res.status(status.UNAUTHORIZED).json({
        error: {
          message: 'You do not have early access to this feature.',
          type: 'invalid_request_error',
        },
      });
    return res.status(status.FORBIDDEN).json({
      error: {
        message: 'You do not have early access to this feature.',
        type: 'invalid_request_error',
      },
    });
  }

  next();
};

export default earlyAccessGuard;
