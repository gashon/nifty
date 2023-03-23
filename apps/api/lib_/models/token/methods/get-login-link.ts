import { IToken } from '../types';

export default function getLoginLink(this: IToken, redirect: string): URL {
  const loginLink = new URL(`${process.env.DASHBOARD_BASE_URL}/auth/login`);
  loginLink.searchParams.append('token', this.id);
  loginLink.searchParams.append('redirect', encodeURIComponent(redirect || '/query'));

  return loginLink;
}
