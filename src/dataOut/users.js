import bcrypt from 'bcrypt';
import { query } from './utils.js';

export async function createUser(username, password) {
  const q = 'INSERT INTO Users (username, password, role_id) VALUES ($1, $2, $3) RETURNING *';

  try {
    const result = await query(q, [username, await bcrypt.hash(password, 10), 1]);
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
  const q = 'SELECT * FROM Users WHERE id = $1;';
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

export async function getAllUsers() {
  const q = 'SELECT * FROM Users;';
  try {
    const result = await query(q);
      return result.rows;
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}