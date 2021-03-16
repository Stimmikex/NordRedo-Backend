import express from 'express';
import { 
  createEvent,
  getAllEventTypes,
  getEvents, getEventById,
  getEventType,
  signUp,
  signOut,
  getSignupByEventId,
  countRegistered,
  ifRegister,
  deleteEvent,
  updateEvent,
} from '../dataOut/events.js'

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
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.role_id === 3) {
      const id = req.params.data;
      const event = await getEventById(id);
      await signUp(null, user.id, event.id);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});

routerEvent.post('/event/:data?/sign-out', ensureLoggedIn, async (req, res) => {
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.role_id === 3) {
      const id = req.params.data;
      const event = await getEventById(id);
      await signOut(user.id, event.id);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});

routerEvent.patch('/event/update/:data?', ensureLoggedIn, async (req, res) => {
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.role_id === 3) {
      const id = req.params.data;
      const data = req.body;
      await updateEvent(data, user, id);
      console.info('Data updated');
    }
  } else {
    console.info('User needs to be admin');
  }
});

routerEvent.delete('/event/delete/:data?', ensureLoggedIn, async (req, res) => {
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.role_id === 3) {
      const id = req.params.data;
      const event = await getEventById(id);
      await deleteEvent(user.id, event.id);
      console.info('Data deleted');
    }
  } else {
    console.info('User needs to be admin');
  }
});

routerEvent.post('/add/event', ensureLoggedIn, async (req, res) => {
  const user = req.user;
  if (typeof user !== 'undefined') {
    if (user.role_id === 3) {
      const data = req.body;
      await createEvent(data, user.id);
      console.info('Data added');
    }
  } else {
    console.info('User needs to be admin');
  }
});
  