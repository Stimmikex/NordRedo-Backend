import express from 'express';
import { createEvent, getAllEventTypes, getEvents, getEventById, getEventType, signUp, signOut, getSignupByEventId, countRegistered, ifRegister, deleteEvent, updateEvent } from '../dataOut/events.js'
import xss from 'xss';
import { body, validationResult } from 'express-validator';
import {
    findById,
  } from '../dataOut/users.js';

export let routerEvent = express.Router();

function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    return res.redirect('/login');
  }
/**
 * Returns json of all events
 */
routerEvent.get('/events', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});
  
/**
 * Return event by id
 */
routerEvent.get('/event/:data?', async (req, res) => {
  const id = req.params.data;
  const event = await getEventById(id);
  res.json(event);
});

routerEvent.post('/event/:data?', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
});

routerEvent.post('/event/:data?/sign-out', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
});

routerEvent.patch('/event/update/:data?', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
});

routerEvent.post('/event/update/:data?', async (req, res) => {
  const id = req.params.data;
});

routerEvent.delete('/event/delete/:data?', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
});

routerEvent.post('/add/event', ensureLoggedIn, async (req, res) => {

});
  