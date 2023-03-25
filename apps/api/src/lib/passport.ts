import User, { IUser } from 'lib/models/user';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    callbackURL: `${process.env.API_BASE_URL}/ajax/auth/login/google/callback`,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  async (accessToken, refreshToken, profile, cb) => {
    const user: IUser = await User.findOneAndUpdate(
      { email: profile._json.email },
      {
        avatar: profile._json.picture,
        last_login: Date.now(),
        verified: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return cb(null, user);
  }
);

// const githubStrategy = new GitHubStrategy({
//   clientID: process.env.GITHUB_CLIENT_ID!,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//   callbackURL: "${process.env.API_BASE_URL}/ajax/auth/login/github/callback"
// },
//   async (accessToken, refreshToken, profile, cb) => {
//     const user: IUser = await User.findOneAndUpdate(
//       { email: profile._json.email },
//       {
//         avatar: profile._json.picture,
//         last_login: Date.now(),
//         verified: true,
//       },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     return cb(null, user);
//   }
// )

// passport.use('github', githubStrategy)
passport.use('google', googleStrategy);

export default passport;
