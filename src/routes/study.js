import dotenv from 'dotenv';
import express from "express";
import * as study from "../dataOut/study.js";
import { body, param, validationResult } from "express-validator";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "../dataOut/login.js";
import cookie from 'cookie';

dotenv.config();

export const routerStudy = express.Router();

routerStudy