import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';

import {
    comparePasswords,
    findByUsername,
    findById,
    createUser,
  } from '../dataOut/users.js';

export let routerUser = express.Router();

  function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    return res.redirect('/login');
  }
  
  // hér væri hægt að bæta við enn frekari (og betri) staðfestingu á gögnum
  async function validateUser(username, password) {
    if (typeof username !== 'string' || username.length < 2) {
      return 'Notendanafn verður að vera amk 2 stafir';
    }
  
    const user = await findByUsername(username);
  
    // Villa frá findByUsername
    if (user === null) {
      return 'Gat ekki athugað notendanafn';
    }
  
    if (user) {
      return 'Notendanafn er þegar skráð';
    }
  
    if (typeof password !== 'string' || password.length < 6) {
      return 'Lykilorð verður að vera amk 6 stafir';
    }
  
    return null;
  }
  
  async function register(req, res, next) {
    const { username, password } = req.body;
    const validationMessage = await validateUser(username, password);
    console.info(validationMessage)
    await createUser(username, password);
    return next();
  }
  
  routerUser.post(
    '/register',
    register,
    passport.authenticate('local', {
      failureMessage: 'Notandanafn eða lykilorð vitlaust.',
      failureRedirect: '/login',
    }),
    (req, res) => {
      res.redirect('/admin');
    },
  );
  
  routerUser.post(
    '/login',
    passport.authenticate('local', {
      failureMessage: 'Notandanafn eða lykilorð vitlaust.',
      failureRedirect: '/login',
    }),
    (req, res) => {
      res.redirect('/admin');
    },
  );
  
  routerUser.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  routerUser.get('/admin', ensureLoggedIn, (req, res) => {
    res.redirect('/');
  });