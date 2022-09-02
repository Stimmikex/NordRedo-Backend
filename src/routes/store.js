import express from 'express';
import { getItems, getItemByName } from '../dataOut/items.js';
import { checkValidationResult, eventRules, paramIdRules, patchEventRules } from './dataValidate/validateRoutes.js';

import { requireAdminAuthentication, requireAuthentication } from '../dataOut/login.js'

export let routerStore = express.Router();

routerStore.get('/', async (req, res) => {
    const items = await getItems();
    res.json(items);
});

routerStore.get('/:itemName',
    paramIdRules(),
    async (req, res) => {
    const name = req.params.itemName;
    const item = await getItemByName(name);
    res.json(item);
});