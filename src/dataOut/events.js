import { query } from './utils.js'

export async function getEventById(id) {
  const q = 'SELECT * FROM events WHERE id = $1';

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

export async function createEvent(title, text, seats, date, startDate, endDate, location, user_id, event_type_id) {
  const q = `
    INSERT INTO
      events (title, text, seats, date, startDate, endDate, location, user_id, event_type_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  try {
    const result = await query(q, [title, text, seats, date, startDate, endDate, location, user_id, event_type_id]);
    return result.rows[0];
  } catch (e) {
    console.error('Could not make event');
  }

  return null;
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
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function countRegistered(id) {
  const q = 'SELECT COUNT(*) FROM signup WHERE event_id = $1';
  try {
    const result = await query(q, [id]);
    return result.rows;
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
  const q = 'SELECT * FROM events';
  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}

export async function deleteEvent(user, event) {
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
    const result = await query(q, [data.title, data.text, data.seats, data. date, data.startDate, data.endDate, data.location, user_id, data.type, id]);
    return result.rows;
  } catch (e) {
    console.error('There is no event with this id');
  }
  return null;
}