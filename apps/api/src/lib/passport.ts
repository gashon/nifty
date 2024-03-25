import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db, sql } from '@nifty/common/db';
import { User } from '@nifty/db/types';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    callbackURL: `${process.env.API_BASE_URL}/ajax/auth/login/google/callback`,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  async (_accessToken, _refreshToken, profile, cb) => {

    // findOrCreate sql query
    const {rows}= await sql<User>`
      INSERT INTO "user" (email, avatar_url, last_login)
      VALUES (${profile._json.email}, ${profile._json.picture}, ${new Date})
      ON CONFLICT (email) DO UPDATE
      SET last_login = ${new Date}
      RETURNING *
    `.execute(db)
    const [user] = rows

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

    // findOrCreate sql query
    const {rows}= await sql<User>`
      INSERT INTO "user" (email, avatar_url, last_login)
      VALUES (${email}, ${profile._json.avatar_url}, ${new Date})
      ON CONFLICT (email) DO UPDATE
      SET last_login = ${new Date}
      RETURNING *
    `.execute(db)
    const [user] = rows

    return cb(null, user);
  }
);

passport.use('github', githubStrategy);
passport.use('google', googleStrategy);

export default passport;
