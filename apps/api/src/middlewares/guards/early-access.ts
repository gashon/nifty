import { RequestHandler, Request, Response, NextFunction } from 'express';
import status from 'http-status';

import Token from '@nifty/server-lib/models/token';
import { IUser } from '@nifty/server-lib/models/user';
import { USER_PERMISSIONS } from '@nifty/common/constants';
import { ACCESS_TOKEN_NAME } from '@nifty/api/constants';

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

  const accessToken = await Token.findById(
    req.cookies[ACCESS_TOKEN_NAME]
  ).populate<{ user: IUser }>('user');

  // redirect to referrer if not early access
  if (
    !accessToken?.user?.permissions?.includes(USER_PERMISSIONS.EARLY_ACCESS)
  ) {
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
