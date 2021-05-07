import express from 'express';
import dotenv from 'dotenv';
import { routerEvent } from './routes/events.js';
import { routerUser } from './routes/user.js';
import { routerStore } from './routes/store.js';
import { routerAdmin } from './routes/admin.js';
import { getEvents } from './dataOut/events.js'
import cookieParser from 'cookie-parser';
import { body, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "./dataOut/login.js";
import cors from 'cors'

dotenv.config();

const app = express();

const {
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
    'Access-Control-Allow-Origin', '*',
  );
  res.header(
    'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH',
  );
  res.header(
    'Access-Control-Allow-Headers', 'Content-Type, Authorization',
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

app.post('/users/register',
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username is required, max 256 characters')
    .custom((value) => {
      return users.getUserByUsername(value).then(user => {
        if(user) {
          return Promise.reject('username already exists');
        }
      });
    }),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('Password is required, min 10 characters, max 256 characters'),
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    
    const token = createTokenForUser(user.id);

    const createdUser = await users.createUser(username, password, token);

    console.log(createdUser);

    if (createdUser) {
      return res.json({
        id: createdUser.id, 
        username: createdUser.name,
        token,
      });
    }

    return res.json({ error: 'Error registering' });
});

app.post('/users/login', 
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username is required, max 256 characters'),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('password is required, min 10 characters, max 256 characters'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await users.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ errors: [{
        value: username,
        msg: "username or password incorrect",
        param: 'username', 
        location: 'body'
      }]});
    }

    const passwordIsCorrect = users.comparePasswords(password, user.password);

    if (passwordIsCorrect) {
      const token = createTokenForUser(user);
      res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 3600,
        path: '/'
      }))
      await users.updateUserTokenById(req.cookies.auth, user.id);
      return res.json({
        "user": {
          id: user.id,
          username: user.username,
          role_id: user.role_id
        },
        token,
        expiresIn: "not implemented",
    });
  }

  return res.status(401).json({ errors: [{
    value: username,
    msg: "username or password incorrect",
    param: 'username', 
    location: 'body'
  }]});
});

app.get('/users/me',
  requireAuthentication,
  (req, res) => {
    return res.json({
      "user": {
        id: req.user.id,
        username: req.user.username,
        role_id: req.user.role_id
      },
  });
});

app.use('/users', routerUser);
app.use('/event', routerEvent);
app.use('/store', routerStore);
app.use('/admin', routerAdmin);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}/`);
});