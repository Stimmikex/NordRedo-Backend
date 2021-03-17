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

import { requireAdminAuthentication } from '../dataOut/login.js'

export let routerEvent = express.Router();

/**
 * Returns json of all events
 */
routerEvent.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});
  
/**
 * Return event by id
 */
routerEvent.get('/:data?', async (req, res) => {
  const id = req.params.data;
  const event = await getEventById(id);
  res.json(event);
});

routerEvent.post('/sign-in/:data?', requireAdminAuthentication, async (req, res) => {
  const user = req.user;
  const id = req.params.data;
  const event = await getEventById(id);
  await signUp(null, user.id, event.id);
  res.send('User signed up')
});

routerEvent.post('/sign-out/:data?/', requireAdminAuthentication, async (req, res) => {
  const user = req.user;
  const id = req.params.data;
  const event = await getEventById(id);
  await signOut(user.id, event.id);
  res.send('Data added');
});

routerEvent.patch('/update/:data?', requireAdminAuthentication, async (req, res) => {
  const user = req.user;
  const id = req.params.data;
  const data = req.body;
  await updateEvent(data, user, id);
  res.send(data + 'has been added');
});

routerEvent.delete('/delete/:data?', requireAdminAuthentication, async (req, res) => {
  const id = req.params.data;
  const user = req.user;
  const event = await getEventById(id);
  await deleteEvent(user.id, event.id);
  res.send(event + ' Has been deleted');
});

routerEvent.post('/add', requireAdminAuthentication, async (req, res) => {
  const data = req.body;
  const user = req.user;
  await createEvent(data, user.id);
  res.send('Data added');
});
  