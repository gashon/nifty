import basicAuth from 'basic-auth';
import { RequestHandler } from 'express';
import status from 'http-status';
import ApiKey from 'lib/models/api-key';
import Token from 'lib/models/token';
import { IUser } from 'lib/models/user';

export default function auth() {
  const authHandler: RequestHandler = async (req, res, next) => {
    if (req.cookies.authorization) {
      // Fetch relevant token
      const token = await Token.findById(req.cookies.authorization).populate<{ user: IUser }>(
        'user'
      );

      // Reject if authorization token not found
      if (!token) return res.sendStatus(status.UNAUTHORIZED);

      // Set locals
      res.locals.user = token.user;

      next();
    }

    return res.status(status.UNAUTHORIZED).send({
      error: {
        message: 'Missing authorization token',
        type: 'invalid_request_error',
      },
    });
  };

  return authHandler;
}
