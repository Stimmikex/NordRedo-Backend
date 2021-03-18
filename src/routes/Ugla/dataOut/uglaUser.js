import { query } from '../../../dataOut/utils.js';

export async function deleteUglaUser(data) {
    const q = 'DELETE FROM profile WHERE users_id = $1; ' + 'DELETE FROM users WHERE id = $1';
    try {
      const result = await query(q, [data]);
        return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
}

export async function createUglaUser(ugluName, role_id, name, email, phone) {
    const q = "WITH insUsers AS (INSERT INTO users "+
            "(username, password, access_id, date_joined, last_login, active) "+
            "VALUES ('"+ugluName+"','!',"+parseInt(role_id)+", '"+
                new Date().toUTCString()+"', '"+new Date().toUTCString()+"', true) RETURNING id)"+
            " INSERT INTO profile (users_id, name, receive_sms, email1, phonenumber1) SELECT insUsers.id, '"+
            name+"', true, '"+email+"', '"+phone+"' FROM insUsers";
    try {
      const result = await query(q, [data]);
        return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
}

export async function updateUglaUser(role_id, user_id) {
    const q = 'UPDATE users SET access_id = $1 WHERE id = $2';
    try {
      const result = await query(q, [role_id, user_id]);
        return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
}