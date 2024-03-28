import * as Sentry from '@sentry/node';

declare global {
  namespace Express {
    interface Response {
      sentry?: string;
      locals: {
        user?: AccessTokenJwt['user'];
      };
    }
  }
}
