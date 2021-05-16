// users.js
import dotenv from 'dotenv';
import express from "express";
import * as users from "../dataOut/users.js";
import { body, param, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "../dataOut/login.js";
import cookie from 'cookie';

dotenv.config();

export const routerUser = express.Router();

routerUser.post('/register',
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

routerUser.post('/login', 
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

routerUser.get('/me',
  requireAuthentication,
  (req, res) => {
    const user = req.user
    const profile = users.getProfileByUsername(user.username)
    console.log(profile)
    return res.json({
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      profile
  });
});

routerUser.patch('/me', 
requireAuthentication,
  body('password')
    .if(body('password').exists())
    .isLength({ min: 10, max: 256 })
    .withMessage('password must be from 1 to 256 characters long'),

  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { password } = req.body;

    if(!password) {
      return res.status(400).json({
        errors: [{
          value: req.body,
          msg: 'require password',
          param: '',
          location:'body'
        }]
      })
    }

    req.user.password = password ? password : req.user.password;

    const user = await users.updateUser(req.user);
    
    res.json({
      id: user.id,
      username: user.name,
      admin: user.role_id,
    });
  });

  routerUser.get('/gov',
  async (req, res) => {
    const event = await users.getGoverment();
    res.json(event);
  });

  routerUser.get('/active',
  async (req, res) => {
    const event = await users.countActiveUsers();
    res.json(event);
  });

  routerUser.patch('/:userId/:roleId',
  requireAdminAuthentication,
  param('id')
    .isInt()
    .withMessage('id must be integer'),
  async (req, res) => {
    await users.updateUserRole(req.params.userId, req.params.roleId);
    res.json({msg: "User has been role updated"});
  });

  routerUser.delete('/:id',
  requireAdminAuthentication,
  param('id')
    .isInt()
    .withMessage('id must be integer'),
  async (req, res) => {
    const event = await users.inactiveUserById(req.params.id);
    res.json(event);
  });
  
  routerUser.get('/find/',
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }
    try {
      const name = req.query.name
      const looking = await users.findUsers(name);
      res.json(looking);
    } catch (error) {
      console.error(error)
    }
  });

routerUser.get('/:id',
requireAdminAuthentication,
param('id')
  .isInt()
  .withMessage('id must be integer'),
async (req, res) => {
  const data = await users.getUserByID(req.params.id);
  if (data) return res.json( data );
  return res.status(404).json({ msg: 'User not found' });
});