import { query } from './utils.js'

export async function getEventById(id) {
  const q = `SELECT events.id, title, text, seats, date, startdate, enddate, location, rating, signup, users.username AS user_id, event_types.name AS event_type
              FROM events
                INNER JOIN users ON users.id = events.user_id 
                INNER JOIN event_types ON event_types.id = events.event_type_id
              WHERE events.id = $1
            `;

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('There is no event with this id');
  }

  return null;
}

export async function createEvent(data) {
  const q = `
    INSERT INTO
      events (title, text, seats, date, startDate, endDate, location, user_id, signup, event_type_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $9, $10, $8)
    RETURNING *
  `;
  try {
    const result = await query(q, [data.title, data.text, data.seats, data.date, data.startDate, data.endDate, data.location, data.event_type_id, data.user, Boolean(data.signup)]);
    return result.rows[0];
  } catch (e) {
    return { error: 'Could not make event'};
  }
}

export async function signUp(status, user, event) {
  const q = `
    INSERT INTO
      signup (signup_status_id, user_id, event_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  try {
    const result = await query(q, [status, user, event]);
    return result.rows[0];
  } catch (e) {
    console.error('Could not signup to event');
  }
  return null;
}

export async function signOut(user, event) {
  const q = `
    DELETE FROM signup WHERE user_id = $1 AND event_id = $2;
  `;
  try {
    const result = await query(q, [user, event]);
    return result.rows[0];
  } catch (e) {
    console.error('Could not signOut to event');
  }
  return null;
}

export async function getSignupByEventId(id) {
  const q = 'SELECT signup.id, signup_status_id, event_id, username, users.id FROM signup INNER JOIN users ON (signup.user_id = users.id) WHERE event_id = $1';
  try {
    const result = await query(q, [id]);
    if(result.rows[0] !== null) {
      return result.rows;
    }
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function countRegistered(id) {
  const q = 'SELECT COUNT(*) FROM signup WHERE event_id = $1';
  try {
    const result = await query(q, [id]);
    return result.rows[0];
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function ifRegister(user, event) {
  const q = 'SELECT * FROM signup WHERE user_id = $1 AND event_id = $2';
  try {
    const result = await query(q, [user, event]);
    console.log("Testing: " + result.rows[0].id);
    if(result.rows[0] !== null) {
      console.log("work? ")
      return false;
    }
    return true;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function getAllEventTypes() {
  const q = 'SELECT * FROM event_types';
  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function getEventType(id) {
  const q = 'SELECT * FROM event_types WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('There is no event with this id');
  }

  return null;
}

export async function getEvents() {
  const q = `SELECT events.id, title, text, seats, date, location, rating, signup, users.username AS user_id, event_types.name AS event_type
              FROM events 
            INNER JOIN users ON users.id = events.user_id 
            INNER JOIN event_types ON event_types.id = events.event_type_id
            ORDER BY date DESC
            `;
  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function findEvent(title, postdate, type) {
  if (postdate === "ASC") {
    const q = `SELECT events.id, title, text, seats, date, location, rating, signup, users.username AS user_id, event_types.name AS event_type
        FROM events 
      INNER JOIN users ON users.id = events.user_id 
      INNER JOIN event_types ON event_types.id = events.event_type_id
        WHERE title LIKE '%' || $1 || '%' AND event_types.name = $2 ORDER BY date ASC;
      `;
    try {
    const result = await query(q, [title, type]);
    return result.rows;
    } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
    }
  } else {
    const q = `SELECT events.id, title, text, seats, date, location, rating, signup, users.username AS user_id, event_types.name AS event_type
        FROM events 
      INNER JOIN users ON users.id = events.user_id 
      INNER JOIN event_types ON event_types.id = events.event_type_id
        WHERE title LIKE '%' || $1 || '%' AND event_types.name = $2 ORDER BY date DESC;
      `;
    try {
    const result = await query(q, [title, type]);
    return result.rows;
    } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
    }
  }
}

export async function deleteEvent(user, event) {
  await deleteSignedByEvent(event)
  const q = `
    DELETE FROM events WHERE user_id = $1 AND id = $2;
  `;
  try {
    const result = await query(q, [user, event]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function deleteSignedByEvent(event) {
  const q = `
    DELETE FROM signup WHERE event_id = $1;
  `;
  try {
    const result = await query(q, [event]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}


export async function updateEvent(data, user_id, id) {
  const q = `
    UPDATE events
      SET title = $1, 
        text = $2, 
        seats = $3, 
        date = $4, 
        startDate = $5, 
        endDate = $6, 
        location = $7, 
        user_id = $8, 
        event_type_id = $9
    WHERE
        user_id = $8
      AND
        id = $10   
  `;
  try {
    const result = await query(q, [data.title, data.text, data.seats, data. date, data.startDate, data.endDate, data.location, user_id, data.event_type_id, id]);
    return result.rows[0];
  } catch (e) {
    console.error('Event failed to update');
  }
  return null;
}

/**
 * Gets the current carpool by the event searched for.
 * @param {*} event 
 * @returns NULL
 */
export async function getCarpoolByEventId(event) {
  const q = `SELECT carpool.id, carpool.seats, username, carpool.event_id FROM carpool
      INNER JOIN users ON users.id = carpool.user_id 
    WHERE event_id = $1
  `;
  try {
    const result = await query(q, [event]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function getSeatsTakenByCarpool(carpool) {
  const q = `SELECT username FROM pooler 
      INNER JOIN users ON users.id = pooler.user_id
    WHERE carpool_id = $1
  `;
  try {
    const result = await query(q, [carpool]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

/**
 * Add or makes a carpool and connects it with user user posted and event for that carpool
 * @param {INTEGER} seats 
 * @param {INTEGER} user (this is the id of the user) 
 * @param {INTEGER} event (this is the id of the event) 
 * @returns 
 */
export async function addCarpoolByEventId(seats, user, event) {
  const q = `
    INSERT INTO
      carpool (seats, user_id, event_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  try {
    const result = await query(q, [seats, user, event]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function addPoolerByCarpoolId(user, carpool) {
  const q = `
    INSERT INTO
      pooler (user_id, carpool_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  try {
    const result = await query(q, [user, carpool]);
    return result.rows;
  } catch (e) {
    console.error('There is no Carpool with this id');
  }
  return null;
}
/**
 * deletes the carpool by the user that posted that carpool
 * @param {INTEGER} user (this is the id of the user) 
 * @param {INTEGER} event (this is the id of the event)
 * @returns 
 */
export async function deleteCarpoolByEventId(user, event) {
  const q = `
    DELETE FROM carpool WHERE user_id = $1 AND id = $2;
  `;
  try {
    const result = await query(q, [user, event]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}
