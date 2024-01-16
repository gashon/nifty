import { NextMiddleware, NextResponse } from 'next/server';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@nifty/api/constants';

const createUrl = (path: string) =>
  new URL(`${process.env.DASHBOARD_BASE_URL}${path}`);

const middleware: NextMiddleware = async function middleware(req) {
  // handle dashboard redirection
  // if is logged in, TODO - ensure tokens are valid
  if (
    req.cookies.get(ACCESS_TOKEN_NAME) &&
    req.cookies.get(REFRESH_TOKEN_NAME)
  ) {
    console.log('hit', req.nextUrl.pathname);
    if (req.nextUrl.pathname === '/')
      return NextResponse.redirect(createUrl('/dashboard'));
  }

  // handle login redirection
  try {
    // Check for the authorization token in the query params
    const [accessToken, refreshToken] = [
      req.nextUrl.searchParams.get('access_token'),
      req.nextUrl.searchParams.get('refresh_token'),
    ];

    // If there is no authorization token, continue
    if (!refreshToken) return NextResponse.next();

    // Set redirect
    const redirect = decodeURIComponent(
      req.nextUrl.searchParams.get('redirect') || '/dashboard'
    );
    // Construct the URL
    const url = createUrl(redirect);

    // Create the response object
    const res = NextResponse.redirect(url);

    // Set the authorization token
    if (accessToken)
      res.cookies.set(ACCESS_TOKEN_NAME, accessToken, {
        maxAge: 60 * 60 * 24 * 365 * 10, // cookie expiration handled on login and UNAUTHORIZED
        path: '/',
        httpOnly: false, // used by the client to check if the user is logged in
      });
    if (refreshToken)
      res.cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
        maxAge: 60 * 60 * 24 * 365 * 10,
        path: '/',
        httpOnly: true,
      });

    return res;
  } catch (err) {
    return NextResponse.redirect(
      `${process.env.DASHBOARD_BASE_URL}/auth/login`
    );
  }
};

export const config = {
  matcher: ['/auth/login', '/auth', '/'],
};

export default middleware;
