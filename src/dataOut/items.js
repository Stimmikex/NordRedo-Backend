import { query } from './utils.js'


export async function getItems() {
    const q = 'SELECT * FROM items';
    try {
      const result = await query(q);
      return result.rows;
    } catch (e) {
      console.error('There is no event with this id');
    }
    return null;
  }

  export async function getItemByName(name) {
    const q = `SELECT items.name, price, text, image, quantity, discount, username, item_types.name as typename FROM items
                INNER JOIN users ON users.id = items.user_id 
                INNER JOIN item_types ON item_types.id = items.type_id
              WHERE items.name = $1`;
    try {
      const result = await query(q, [name]);
      return result.rows[0];
    } catch (e) {
      console.error('There is no event with this id');
    }
    return null;
  }