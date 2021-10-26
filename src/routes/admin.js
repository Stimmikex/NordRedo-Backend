import express from 'express';
import { getAllAds, getAllUsers, getRoles, updateGovRoleByUserId} from '../dataOut/admin.js';

import { validationResult } from "express-validator";
import { requireAdminAuthentication, requireAuthentication} from "../dataOut/login.js";
import { getGoverment } from '../dataOut/users.js';

export let routerAdmin = express.Router();

routerAdmin.get('/ads',
  async (req, res) => {
    const ads = await getAllAds();
    res.json(ads);
  });

  routerAdmin.get('/members',
  requireAdminAuthentication,
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

  routerAdmin.get('/roles',
  requireAdminAuthentication, 
  async (req, res) => {
    const roles = await getRoles();
    res.json(roles);
  });

  routerAdmin.get('/gov',
  requireAdminAuthentication,
  async (req, res) => {
    const gov = await getGoverment();
    res.json(gov);
  });

  routerAdmin.patch('/gov/change/:userId/:govId',
  requireAdminAuthentication,
  async (req, res) => {
    const userID = req.params.userId;
    const govID = req.params.govId;
    await updateGovRoleByUserId(userID, govID);
    res.json({msg: "User has been role updated"});
  });
