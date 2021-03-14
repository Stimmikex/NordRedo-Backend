import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { routerEvent } from './routes/events.js';
import { routerUser } from './routes/user.js';
import { routerStore } from './routes/store.js';
import { getEvents } from './dataOut/events.js'
import {
  comparePasswords,
  findByUsername,
  findById,
} from './dataOut/users.js';

dotenv.config();

const app = express();

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret,
  DATABASE_URL: databaseUrl,
} = process.env;

if (!sessionSecret || !databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

async function strat(username, password, done) {
  try {
    const user = await findByUsername(username);

    if (!user) {
      return done(null, false);
    }

    // Verður annað hvort notanda hlutur ef lykilorð rétt, eða false
    const result = await comparePasswords(password, user.password);

    return done(null, result ? user : false);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  console.log('user :>> ', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

app.use(routerUser);
app.use(routerEvent);
app.use(routerStore);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});