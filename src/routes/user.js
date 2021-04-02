// users.js
import dotenv from 'dotenv';
import express from "express";
import * as users from "../dataOut/users.js";
import { body, param, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "../dataOut/login.js";

dotenv.config();

export const routerUser = express.Router();

routerUser.get('/',
  requireAdminAuthentication,
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }
    try {
      const items = await users.getAllUsers();
      res.json(items);
    } catch (error) {
      console.error(error)
    }
  });

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

    const createdUser = await users.createUser(username, password);

    console.log(createdUser);

    if (createdUser) {
      return res.json({
        id: createdUser.id, 
        username: createdUser.name,
        token: createTokenForUser(createdUser.id),
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
      const token = createTokenForUser(user.id);
      res.header('Access-Control-Expose-Headers', token)
      return res.json({
        "user": {
          id: user.id,
          username: user.name,
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
    res.json({
      id: req.user.id,
      username: req.user.username,
      role_id: req.user.role_id,
    });
  });


routerUser.patch('/me', requireAuthentication,
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

routerEvent.get('/gov',
  async (req, res) => {
    const event = await users.getGoverment();
    res.json(event);
  });

routerEvent.get('/active',
  async (req, res) => {
    const event = await users.countActiveUsers();
    res.json(event);
  });
  
routerUser.get('/:id',
requireAdminAuthentication,
param('id')
  .isInt()
  .withMessage('id must be integer'),
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = await users.getUserByID(req.params.id);
  if (data) return res.json( data );
  return res.status(404).json({ msg: 'User not found' });
});