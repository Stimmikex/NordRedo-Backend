import dotenv from 'dotenv';
import express from "express";
import * as study from "../dataOut/study.js";
import { body, param, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "../dataOut/login.js";
import cookie from 'cookie';

dotenv.config();

export const routerStudy = express.Router();

routerStudy.get('/', async (req, res) => {
    const classes = await study.getClasses();
    return res.json(classes)
});

routerStudy.get('/class/search/', async (req, res) => {
    const name = req.query.name;
    const classer = await study.getClassByName(name);
    res.json(classer)
});

routerStudy.get('/class/:classId/year/', async (req, res) => {
    const class_id = req.params.classId;
    const years = await study.getYearsByClassID(class_id);
    res.json(years)
});

routerStudy.get('/class/:classId/count/notes', async (req, res) => {
    const class_id = req.params.classId;
    const stats = await study.countNotesByClassID(class_id);
    res.json(stats)
});

routerStudy.get('/class/:classId/notes/', async (req, res) => {
    const class_id = req.params.classId;
    const notes = await study.getNotesByClassID(class_id);
    res.json(notes)
});

routerStudy.get('/class/notes/:noteId', async (req, res) => {
    const note_id = req.params.noteId;
    const note = await study.getNotesByClassID(note_id);
    res.json(note)
});

routerStudy.get('/class/:userId/user/', async (req, res) => {
    const user_id = req.params.userId;
    const notes = await study.getNotesByUserID(user_id);
    res.json(notes)
});

routerStudy.get('/class/:classId', async (req, res) => {
    const id = req.params.classId;
    const classer = await study.getClassByID(id);
    res.json(classer)
});

routerStudy.get('/class/year/:yearId/notes/', async (req, res) => {
    const year_id = req.params.yearId;
    const year = await study.getNotesByYearID(year_id);
    res.json(year)
});

routerStudy.get('/class/year/:yearId', async (req, res) => {
    const year_id = req.params.yearId;
    const year = await study.getYearByID(year_id);
    res.json(year)
});
