import {
  body, query, param, validationResult,
} from 'express-validator';
import { getEventById } from '../../dataOut/events.js';
// import { getItemById } from '../../dataOut/items.js';
import { getUserByUsername } from '../../dataOut/users.js';
// Þetta disable verður að vera hér svo þessi validation
// rules haga sér rétt
/* eslint-disable consistent-return */
export const eventRules = () => [
  body('title')
    .isLength({ min: 1 })
    .isLength({ max: 128 })
    .withMessage('title is required, max 128 characters'),
  body('text')
    .isString()
    .withMessage('text must be a TEXT'),
  body('seats')
    .isInt()
    .isLength({ min: 0, max: 420 })
    .withMessage('Seats is required, max 420 integer number'),
  body('date')
    .isDate()
    .withMessage('description must be a string'),
  body('startDate')
    .isDate()
    .withMessage('startDate must be a date'),
  body('endDate')
    .isDate()
    .withMessage('endDate must be a date'),
  body('location')
    .isString(),
  body('user_id')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
  body('event_type_id')
    .isInt()
    .custom((value) => value > 0)
    .withMessage('must be an integer larger than 0'),
];

export const patchEventRules = () => [
  body()
    .custom((value, { req }) => req.body.title
      || req.body.text
      || req.body.seats
      || req.body.date
      || req.body.startDate
      || req.body.endDate
      || req.body.location)
    .withMessage('require at least one value of: title, text, seats, date, startDate, endDate, location'),
];

export const seasonRules = () => [
  body('name')
    .isLength({ min: 1 })
    .isLength({ max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('number')
    .isInt()
    .custom((value) => Number.parseInt(value, 10) >= 0),
];

export const paginationRules = () => [
  query('offset')
    .if(query('offset').exists())
    .custom((value) => Number.parseInt(value, 10) >= 0)
    .withMessage('offset must be a positive integer'),
  query('limit')
    .if(query('limit').exists())
    .custom((value) => Number.parseInt(value, 10) >= 0)
    .withMessage('limit must be a positive integer'),
];

// vonandi er hægt að senda inn streng idField sem að er nafnið á
// param breytunni
export const paramIdRules = (idField) => [
  param(idField)
    .isInt()
    .custom((value) => value > 0)
    .withMessage(`${idField} must be an integer larger than 0`),
];

export const patchUserRules = () => [
  body('password')
    .if(body('password').exists())
    .isLength({ min: 10, max: 256 })
    .withMessage('password must be from 1 to 256 characters long'),
];

export const loginRules = () => [
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username is required, max 256 characters'),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('password is required, min 10 characters, max 256 characters'),
];

export const registerRules = () => [
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username is required, max 256 characters')
    .custom((value) => getUserByUsername(value).then((user) => {
      if (user) {
        return Promise.reject('username already exists');
      }
    })),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('Password is required, min 10 characters, max 256 characters'),
];

// export async function itemExists(req, res, next) {
// const { itemId } = req.params;
//   const item = await getItemById(itemId);
//   if (!item) {
//     return res.status(404).json({
//       errors: [{
//         param: 'id',
//         msg: 'Could not find item with this id',
//         location: 'params',
//       }],
//     });
//   }
//   return next();
// }

export async function eventExists(req, res, next) {
  const { eventId } = req.params;
  const event = await getEventById(eventId);
  if (!event) {
    return res.status(404).json({
      errors: [{
        param: 'id',
        msg: 'Could not find event with this id',
        location: 'params',
      }],
    });
  }
  return next();
}


export function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
}
