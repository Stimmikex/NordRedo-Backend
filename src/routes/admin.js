import express from 'express';
import { getAllAds, getAllUsers} from '../dataOut/admin.js';

import { validationResult } from "express-validator";
import { requireAdminAuthentication } from "../dataOut/login.js";
import { getGoverment } from '../dataOut/users.js';

export let routerAdmin = express.Router();

routerAdmin.get('/ads',
  // requireAdminAuthentication, 
  async (req, res) => {
    const ads = await getAllAds();
    res.json(ads);
  });

  routerAdmin.get('/members',
   // requireAdminAuthentication,
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }
    try {
      const items = await getAllUsers();
      res.json(items);
    } catch (error) {
      console.error(error)
    }
  });

  routerAdmin.get('/gov',
  // requireAdminAuthentication,
  async (req, res) => {
    const event = await getGoverment();
    res.json(event);
  });
