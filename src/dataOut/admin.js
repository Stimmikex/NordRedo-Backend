import { query } from './utils.js';

export async function createAd(name, link) {
    const q = 'INSERT INTO Users (name, link) VALUES ($1, $2) RETURNING *';
  
    try {
      const result = await query(q, [name, link]);
      if (result.rowCount === 1){
        return result.rows[0];
      }
    }
    catch (error) {
      console.error('Error creating ad', error);
    }
    return false;
  }

  export async function getAllAds() {
    const q = 'SELECT * FROM ads';
    try {
      const result = await query(q);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

  export async function getRoles() {
    const q = 'SELECT * FROM roles';
    try {
      const result = await query(q);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

  export async function getAllUsers() {
    const q = `SELECT users.id, username, roles.name, date_joined, last_login, active FROM users
                  INNER JOIN roles ON roles.id = users.role_id
    `;
    try {
      const result = await query(q);
        return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

  export async function updateGovRoleByUserId(userId, govId) {
    const q = 'UPDATE government SET user_id=$1 WHERE id=$2';
    try {
      const result = await query(q, [userId, govId]);
        return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }