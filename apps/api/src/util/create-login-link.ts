import { IToken } from "@nifty/server-lib/models/token";
import { IRefreshToken } from "@nifty/server-lib/models/refresh-token";

type TokenIds = {
  accessToken: IToken;
  refreshToken: IRefreshToken;
};

export default function createLoginLink({ accessToken, refreshToken }: TokenIds, redirect: string): URL {
  const loginLink = new URL(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

  loginLink.searchParams.append('access_token', encodeURIComponent(accessToken.id));
  loginLink.searchParams.append('refresh_token', encodeURIComponent(refreshToken.id))
  loginLink.searchParams.append('redirect', encodeURIComponent(redirect));

  return loginLink;
}