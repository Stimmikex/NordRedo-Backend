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
  getUserByUsername,
  getUserByID,
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

app.use(express.json());
app.use(passport.initialize());

app.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

app.use('/users', routerUser);
app.use('/event', routerEvent);
app.use('/store', routerStore);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});