import { NextMiddleware, NextResponse } from 'next/server';
import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS, REFRESH_TOKEN_EXPIRATION_IN_SECONDS } from 'common/constants';

const middleware: NextMiddleware = async function middleware(req) {
  try {
    // Check for the authorization token in the query params
    const [accessToken, refreshToken] = [
      req.nextUrl.searchParams.get('access_token'),
      req.nextUrl.searchParams.get('refresh_token'),
    ]
    if (!accessToken) return NextResponse.next();

    // Set redirect
    const redirect = decodeURIComponent(req.nextUrl.searchParams.get('redirect') || '/d');
    // Construct the URL
    const url = new URL(`${process.env.DASHBOARD_BASE_URL}${redirect}`);

    // Create the response object
    const res = NextResponse.redirect(url);

    // Set the authorization token
    res.cookies.set('access_token', accessToken, {
      maxAge: ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
      path: '/',
      httpOnly: true,
    });
    res.cookies.set('refresh_token', refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS,
      path: '/',
      httpOnly: true,
    });

    return res;
  } catch (err) {
    console.error('err', err);
    return NextResponse.redirect(`${process.env.DASHBOARD_BASE_URL}/auth/login`);
  }
};

export const config = {
  matcher: '/auth/login',
};

export default middleware;
