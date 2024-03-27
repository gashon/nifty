import { RefreshToken, TokenStrategy, User } from './pg';

export * from './pg';

export type AccessTokenJwt = {
  user: User;
  strategy: TokenStrategy;
  requestIp: string;
  requestUserAgent: string;
  expiresAt: Date;
};

export type RefreshTokenJwt = {
  user: User;
  strategy: TokenStrategy;
  requestIp: string;
  requestUserAgent: string;
  expiresAt: Date;
};
