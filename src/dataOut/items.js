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