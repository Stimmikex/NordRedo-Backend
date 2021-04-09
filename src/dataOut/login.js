import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { getUserByID, getUserByToken } from './users.js';
import CookieStrategy from 'passport-cookie';

export default passport;

dotenv.config();

const {
  JWT_SECRET: jwtSecret,
  JWT_TOKENLIFETIME: tokenLifetime = 3600,
} = process.env;

if (!jwtSecret) {
  console.error('Vantar jwt secret í .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = findByToken(token);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

// passport.use(new CookieStrategy({
//   cookieName: 'auth',
//   signed: true,
//   passReqToCallback: true
// }, function(req, token, done) {
//     const user = getUserByToken(token);
//     req.user = user;
// }))

function findByToken(token) {
  return jwt.decode(token, jwtSecret);
}

// passport.use(new CookieStrategy({
//   cookieName: 'auth',
//   signed: true,
//   passReqToCallback: true
// }, function(req, token, done) {
//     token = findByToken(token);
//     next();
// }))

const cookieOptions = {
    cookieName: 'auth',
    signed: true,
    passReqToCallback: true
}

passport.use(new CookieStrategy(cookieOptions, strat))

export function createTokenForUser(id) {
  const payload = { user: id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtSecret, tokenOptions);
  return token;
}

export function requireAuthentication(req, res, next) {
  return passport.authenticate(
    "cookie",
    { session: false },
    (err, info) => {
      if (err) {
        return next(err);
      }
      const user = findByToken(req.cookies.auth);
      if (!user) {
        const error = 'invalid token';
        return res.status(401).json({ error });
      }
      req.user = user.user;
      return next()
    },
  )(req, res, next);
}

export function requireAdminAuthentication(req, res, next) {
  return passport.authenticate(
    "cookie",
    { session: false },
    (err, info) => {
      if (err) {
        return next(err);
      }
      const user = findByToken(req.cookies.auth);
      if (!user) {
        const error = 'invalid token';
        return res.status(401).json({ error });
      }

      if (user.role_id !== 3) {
        return res.status(401).json({ error: 'User does not have admin priviledges' });
      }

      req.user = user.user;
      return next()
    },
  )(req, res, next);
}