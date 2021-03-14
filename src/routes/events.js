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
  const event = await getEventById(id);
  const user = await findById(req.user.id);
  await signUp(null, user.id, event.id);
  console.info('Data added');
});

routerEvent.post('/event/:data?/sign-out', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
  const event = await getEventById(id);
  const user = await findById(req.user.id);
  await signOut(user.id, event.id);
  console.info('Data added');
});

routerEvent.patch('/event/update/:data?', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
  const data = req.body;
  const user = await findById(req.user.id);
  await updateEvent(data, user, id);
  console.info('Data updated');
});

routerEvent.delete('/event/delete/:data?', ensureLoggedIn, async (req, res) => {
  const id = req.params.data;
  const event = await getEventById(id);
  const user = await findById(req.user.id);
  await deleteEvent(user.id, event.id);
  console.info('Data deleted');
});

routerEvent.post('/add/event', ensureLoggedIn, async (req, res) => {
  const data = req.body;
  const user_id = req.user.id;
  await createEvent(data, user_id);
  console.info('Data added');
});
  