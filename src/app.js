import express from 'express';
import dotenv from 'dotenv';
import { routerEvent } from './routes/events.js';
import { routerUser } from './routes/user.js';
import { routerStore } from './routes/store.js';
import { routerAdmin } from './routes/Ugla/uglaUser.js';
import { getEvents } from './dataOut/events.js'

dotenv.config();

const app = express();

const {
  DATABASE_URL: databaseUrl,
} = process.env;

if (!databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin', '*',
  );
  res.header(
    'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE',
  );
  res.header(
    'Access-Control-Allow-Headers', 'Content-Type'
  );
  next();
});

app.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

app.use('/users', routerUser);
app.use('/event', routerEvent);
app.use('/store', routerStore);
app.use('/admin', routerAdmin);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}/`);
});