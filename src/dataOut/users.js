import bcrypt from 'bcrypt';
import { query } from './utils.js';

export async function createUser(username, password, token) {
  const q = 'INSERT INTO Users (username, password, role_id, date_joined, last_login, active, token) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  try {
    const result = await query(q, [username, await bcrypt.hash(password, 10), 1, new Date().toUTCString(), new Date().toUTCString(), true, token]);
    if (result.rowCount === 1){
      return result.rows[0];
    }
  }
  catch (error) {
    console.error('Error creating user', error);
  }
  return false;
}

export async function updateUser(user) {
  const q = 'UPDATE Users SET email=$1, password=$2 WHERE id=$3 RETURNING *';

  try {
    const result = await query(q, [user.email, user.password, user.id]);

    if(result.rowCount === 1) {
      return result.rows[0];
    }
  }
  catch (err) {
    console.error('Could not update user', err);
    return null;
  }
  return false;
}

export async function getUserByUsername(name) {
  const q = 'SELECT * FROM Users WHERE username = $1;';

  try {
    const result = await query(q, [name]);

    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function getUserByID(id) {
  const q = 'SELECT id, username, role_id, date_joined, last_login, active FROM Users WHERE id = $1;';
  try {
    const result = await query(q, [id]);
    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function countActiveUsers() {
  const q = 'SELECT COUNT(*) FROM Users WHERE active = true;';
  try {
    const result = await query(q);
      return result.rows[0];
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
}

export async function getGoverment() {
  const q = `SELECT government.id, government_type.title AS title, year, users.username AS username FROM government
              INNER JOIN users ON users.id = government.user_id
              INNER JOIN government_type ON government_type.id = government.gov_type
  `;
  try {
    const result = await query(q);
      return result.rows;
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
}

export async function updateUserTokenById(token, id) {
  const q = 'UPDATE Users SET token=$1 WHERE id=$2 RETURNING *';

  try {
    const result = await query(q, [token, id]);

    if(result.rowCount === 1) {
      return result.rows[0];
    }
  }
  catch (err) {
    console.error('Could not update user', err);
    return null;
  }
  return false;
}

export async function getUserByToken(token) {
  const q = 'SELECT * FROM Users WHERE token = $1;';
  try {
    const result = await query(q, [token]);
    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function inactiveUserById(id) {
  const q = `
    UPDATE users
      SET active = false
    WHERE
        id = $1 
  `;
  try {
    const result = await query(q, [id]);
    return result.rows[0];
  } catch (e) {
    console.error('Could not set user inactive');
  }
  return null;
}

export async function updateUserRole(user_id, role_id) {
  const q = `
    UPDATE users
      SET role_id = $2
    WHERE
        id = $1
  `;
  try {
    const result = await query(q, [user_id, role_id]);
    return result.rows[0];
  } catch (e) {
    console.error('Could not set user inactive');
  }
  return null;
}

export async function findUsers(name) {
  const q = `
    SELECT users.id, username, roles.name, date_joined, last_login, active 
      FROM users
    INNER JOIN roles ON roles.id = users.role_id 
      WHERE username LIKE '%' || $1 || '%'
  `;
  try {
    const result = await query(q, [name]);
    return result.rows;
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
}

export async function getProfileByUsername(username) {
  const q = 'SELECT * FROM profile WHERE username = $1;';
  try {
    const result = await query(q, [username]);
    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}