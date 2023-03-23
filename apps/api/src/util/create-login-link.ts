import { IToken } from "lib/models/token";
import { IRefreshToken } from "lib/models/refresh-token";

type TokenIds = {
  accessToken: IToken;
  refreshToken: IRefreshToken;
};

export default function createLoginLink({ accessToken, refreshToken }: TokenIds, redirect: string): URL {
  const loginLink = new URL(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

  loginLink.searchParams.append('access_token', accessToken.id);
  loginLink.searchParams.append('refresh_token', refreshToken.id)
  loginLink.searchParams.append('redirect', encodeURIComponent(redirect));
  return loginLink;
}