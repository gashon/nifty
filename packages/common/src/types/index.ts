import { RefreshToken, Selectable, TokenStrategy, User } from './pg';

export * from './pg';

export type AccessTokenJwt = {
  user: Selectable<User>;
  strategy: TokenStrategy;
  requestIp: string;
  requestUserAgent: string;
  expiresAt: Date;
};

export type RefreshTokenJwt = {
  user: Selectable<User>;
  strategy: TokenStrategy;
  requestIp: string;
  requestUserAgent: string;
  expiresAt: Date;
};
