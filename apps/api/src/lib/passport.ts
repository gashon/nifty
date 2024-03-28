import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

import { db, sql } from '@nifty/common/db';
import type { User } from '@nifty/common/types';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    callbackURL: `${process.env.API_BASE_URL}/ajax/auth/login/google/callback`,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    // insertOrUpdate on email conflict
    const user = await db
      .insertInto('user')
      .values({
        email: profile._json.email!,
        avatarUrl: profile._json.picture,
        lastLogin: new Date(),
      })
      .onConflict((oc) =>
        oc.column('email').doUpdateSet({
          lastLogin: new Date(),
        })
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return cb(null, user);
  }
);

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: `${process.env.API_BASE_URL}/ajax/auth/login/github/callback`,
    scope: ['user:email', 'read:user'],
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    cb: any
  ) => {
    const email =
      profile.emails?.find((e: any) => e.primary?.value) ||
      profile.emails?.[0]?.value;
    if (!email) return cb(new Error('No email found'));

    // insertOrUpdate on email conflict
    const user = await db
      .insertInto('user')
      .values({
        email,
        avatarUrl: profile._json.picture,
        lastLogin: new Date(),
      })
      .onConflict((oc) =>
        oc.column('email').doUpdateSet({
          lastLogin: new Date(),
        })
      )
      .returningAll()
      .execute();

    return cb(null, user);
  }
);

passport.use('github', githubStrategy);
passport.use('google', googleStrategy);

export default passport;
