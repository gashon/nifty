import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "@/constants";
import { RefreshToken } from "@nifty/common/types";

type Tokens = {
  encodedAccessToken: string;
  encodedRefreshToken: string;
};

export default function createLoginLink({ encodedAccessToken, encodedRefreshToken}: Tokens, redirect: string): URL {
  const loginLink = new URL(`${process.env.DASHBOARD_BASE_URL}/auth/login`);

  loginLink.searchParams.append(ACCESS_TOKEN_NAME, encodeURIComponent(encodedAccessToken));
  loginLink.searchParams.append(REFRESH_TOKEN_NAME, encodeURIComponent(encodedRefreshToken))
  loginLink.searchParams.append('redirect', encodeURIComponent(redirect));

  return loginLink;
}
