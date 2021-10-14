import express from 'express';
import { 
  createEvent,
  getAllEventTypes,
  getEvents,
  getEventById,
  getEventType,
  signUp,
  signOut,
  getSignupByEventId,
  countRegistered,
  ifRegister,
  deleteEvent,
  updateEvent,
  findEvent,
} from '../dataOut/events.js'

import { checkValidationResult, eventRules, paramIdRules, patchEventRules } from './dataValidate/validateRoutes.js';

import { requireAdminAuthentication, requireAuthentication } from '../dataOut/login.js'

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
routerEvent.get('/registered/:eventId', async (req, res) => {
   const id = req.params.eventId;
   const event = await getEventById(id);
   const registered = await getSignupByEventId(event.id);
   res.json(registered);
 });

routerEvent.post('/sign-in/:eventId',
requireAuthentication,
  paramIdRules(),
  async (req, res) => {
    // const user = req.user;
    const user = req.body.user_id;
    const id = req.params.eventId;
    const event = await getEventById(id);
    // await signUp(null, user.id, event.id);
    await signUp(null, user, event.id);
    res.json({msg: 'User signed up'});
  });

routerEvent.post('/sign-out/:eventId',
requireAuthentication,
  paramIdRules(),
  async (req, res) => {
    const user = req.user;
    const id = req.params.eventId;
    const event = await getEventById(id);
    await signOut(user.id, event.id);
    res.json({msg: 'User signed out'});
  });

routerEvent.patch('/update/:eventId',
  requireAdminAuthentication,
  patchEventRules(),
  // paramIdRules(),
  checkValidationResult,
  async (req, res) => {
    const user = req.user;
    const id = req.params.eventId;
    const data = req.body;
    await updateEvent(data, user, id);
    res.json({msg: data.title + ' has been updated'});
  });

routerEvent.delete('/delete/:eventId',
  requireAdminAuthentication,
  paramIdRules(),
  async (req, res) => {
    const id = req.params.eventId;
    const user = req.user;
    const event = await getEventById(id);
    await deleteEvent(user, event.id);
    res.json({msg: event.title + '  has been deleted'});
  });

routerEvent.post('/add', 
  requireAdminAuthentication,
  eventRules(),
  checkValidationResult,
  async (req, res) => {
    const data = req.body;
    console.log(data)
    const user = req.user;
    console.log(user)
    const event = await createEvent(data);
    res.json({msg: event.title + ' has been added'});
  });

routerEvent.get('/list/:eventId',
  paramIdRules(),
  async (req, res) => {
    const id = req.params.eventId;
    const data = await getSignupByEventId(id);
    res.json(data);
});

routerEvent.get('/count/:eventId',
  paramIdRules(),
  async (req, res) => {
    const id = req.params.eventId;
    const data = await countRegistered(id);
    res.json(data);
});

routerEvent.get('/types',
  async (req, res) => {
    const event = await getAllEventTypes();
    res.json(event);
  });

routerEvent.get('/:eventId',
  paramIdRules(),
  async (req, res) => {
    const id = req.params.eventId;
    const event = await getEventById(id);
    res.json(event);
  });

  routerEvent.get('/search',
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }
    try {
      const name = req.query.name
      const postdate = req.query.postdate
      const type = req.query.type
      const looking = await findEvent(name, postdate, type);
      res.json(looking);
    } catch (error) {
      console.error(error)
    }
  });

  