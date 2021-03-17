import express from 'express';
import { getItems } from '../dataOut/items.js';
export let routerStore = express.Router();

routerStore.get('/', async (req, res) => {
    const items = await getItems();
    res.json(items);
  });