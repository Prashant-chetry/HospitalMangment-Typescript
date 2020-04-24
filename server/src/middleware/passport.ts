import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users from '../db/models/users/collection';
import IUsers from '../db/models/users/interface';
import isEmpty from '../common/isEmpty';
import HttpError from '../common/httpError';
require('dotenv').config();

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IJwtPayload {
  iss: 'hospitalManager';
  sub: IUsers['_id'];
  iat: number;
  exp: number;
}

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (payload: IJwtPayload, done) {
      console.log(payload, 'payload');
      try {
        const user: IUsers | null = await Users.findById(payload?.sub);
        if (isEmpty(user || {})) return done(new HttpError(false, 403, "user doesn't exists"), false);
        if (new Date().getTime() > new Date(payload?.exp).getTime()) return done(new HttpError(false, 403, 'token expired'), false);
        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/google/reDirect',
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(accessToken, refreshToken, profile, 'google oath');
    },
  ),
);
export default passport;
