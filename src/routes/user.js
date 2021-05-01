// users.js
import dotenv from 'dotenv';
import express from "express";
import * as users from "../dataOut/users.js";
import { body, param, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "../dataOut/login.js";
import cookie from 'cookie';

dotenv.config();

export const routerUser = express.Router();

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
  // requireAdminAuthentication,
  param('id')
    .isInt()
    .withMessage('id must be integer'),
  async (req, res) => {
    const event = await users.updateUserRole(req.params.userId, req.params.roleId);
    res.json(event);
  });

  routerUser.delete('/:id',
  // requireAdminAuthentication,
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
// requireAdminAuthentication,
param('id')
  .isInt()
  .withMessage('id must be integer'),
async (req, res) => {
  const data = await users.getUserByID(req.params.id);
  if (data) return res.json( data );
  return res.status(404).json({ msg: 'User not found' });
});