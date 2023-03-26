import { NextMiddleware, NextResponse } from 'next/server';

const middleware: NextMiddleware = async function middleware(req) {
  try {
    // Check for the authorization token in the query params
    const [accessToken, refreshToken] = [
      req.nextUrl.searchParams.get('access_token'),
      req.nextUrl.searchParams.get('refresh_token'),
    ]
    if (!refreshToken) return NextResponse.next();

    // Set redirect
    const redirect = decodeURIComponent(req.nextUrl.searchParams.get('redirect') || '/d');
    // Construct the URL
    const url = new URL(`${process.env.DASHBOARD_BASE_URL}${redirect}`);

    // Create the response object
    const res = NextResponse.redirect(url);

    // Set the authorization token
    if (accessToken)
      res.cookies.set('access_token', accessToken, {
        maxAge: 60 * 60 * 24 * 365 * 10, // cookie expiration handled on login and UNAUTHORIZED
        path: '/',
        httpOnly: true,
      });
    if (refreshToken)
      res.cookies.set('refresh_token', refreshToken, {
        maxAge: 60 * 60 * 24 * 365 * 10,
        path: '/',
        httpOnly: true,
      });

    return res;
  } catch (err) {
    return NextResponse.redirect(`${process.env.DASHBOARD_BASE_URL}/auth/login`);
  }
};

export const config = {
  matcher: '/auth/login',
};

export default middleware;
