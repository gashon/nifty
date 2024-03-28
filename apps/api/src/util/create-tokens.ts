import { createToken } from '@nifty/api/lib/jwt';
import type {
  User,
  TokenStrategy,
  AccessTokenJwt,
  RefreshTokenJwt,
  Selectable,
} from '@nifty/common/types';
import {
  ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
  REFRESH_TOKEN_EXPIRATION_IN_SECONDS,
} from '@nifty/api/constants';

type OutputTokens = {
  encodedAccessToken: string;
  encodedRefreshToken: string;
};

type MetaParams = {
  strategy: TokenStrategy;
  requestIp: string;
  requestUserAgent: string;
};

export const generateAccessToken = (
  user: Selectable<User>,
  { strategy, requestIp, requestUserAgent }: MetaParams
) => {
  const expiresAt = new Date(
    Date.now() + ACCESS_TOKEN_EXPIRATION_IN_SECONDS * 1000
  );
  const accessToken: AccessTokenJwt = {
    user,
    strategy,
    requestIp,
    requestUserAgent,
    expiresAt,
  };

  const encoded = createToken<AccessTokenJwt>(accessToken);
  return { encoded, expiresAt };
};

export const generateRefreshToken = (
  user: Selectable<User>,
  { strategy, requestIp, requestUserAgent }: MetaParams
) => {
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000
  );
  const refreshToken: RefreshTokenJwt = {
    user,
    strategy,
    requestIp,
    requestUserAgent,
    expiresAt,
  };

  const encoded = createToken<RefreshTokenJwt>(refreshToken);
  return { encoded, expiresAt };
};

export const generateAuthTokens = async (
  user: Selectable<User>,
  {
    strategy,
    requestIp,
    requestUserAgent,
  }: {
    strategy: TokenStrategy;
    requestIp: string;
    requestUserAgent: string;
  }
): Promise<OutputTokens> => {
  // Generate the tokens
  const { encoded: encodedAccessToken } = generateAccessToken(user, {
    strategy,
    requestIp,
    requestUserAgent,
  });

  const { encoded: encodedRefreshToken } = generateRefreshToken(user, {
    strategy,
    requestIp,
    requestUserAgent,
  });

  return {
    encodedAccessToken,
    encodedRefreshToken,
  };
};
