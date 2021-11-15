import express from 'express';
import dotenv from 'dotenv';
import { routerEvent } from './routes/events.js';
import { routerUser } from './routes/user.js';
import { routerStore } from './routes/store.js';
import { routerAdmin } from './routes/admin.js';
import { routerStudy } from './routes/study.js';
import { getEvents } from './dataOut/events.js'
import cookieParser from 'cookie-parser';
import { body, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "./dataOut/login.js";
import * as users from "./dataOut/users.js";
import cookie from 'cookie';
import cors from 'cors'

dotenv.config();

const app = express();

const {
  FRONTEND_URL: frontUrl,
  DATABASE_URL: databaseUrl,
} = process.env;

if (!databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// app.use(cors())

app.use((_req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin', `${frontUrl}`,
  );
  res.header(
    'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH',
  );
  res.header(
    "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    'Access-Control-Allow-Credentials', 'true',
  );
  next();
});

app.use(cookieParser())

app.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

app.use('/users', routerUser);
app.use('/event', routerEvent);
app.use('/store', routerStore);
app.use('/admin', routerAdmin);
app.use('/study', routerStudy);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}/`);
});