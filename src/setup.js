import pg from 'pg';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { createUser } from '../src/dataOut/users.js';

async function readFileAsync(sql) {
  try {
    const file = await fs.readFile(sql);
    return file;
  } catch (e) {
    throw new Error(e);
  }
}

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, v = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(q, v);
    return result.rows;
  } catch (e) {//eslint-disable-line
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  // eslint-disable-next-line no-template-curly-in-string
  console.info(`Set upp gagnagrunn á ${connectionString}`);

  // búa til töflu út frá skema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  try {
    const role_q1 = 'INSERT INTO roles (name) VALUES ($1)';
    await query(role_q1, ['member']);
    const role_q2 = 'INSERT INTO roles (name) VALUES ($1)';
    await query(role_q2, ['gov']);
    const role_q3 = 'INSERT INTO roles (name) VALUES ($1)';
    await query(role_q3, ['admin']);
    console.info(
      { 
        roles: {
          role1: 'nember',
          role2: 'gov',
          role3: 'admin',
        },
        msg: 'roles added',
      }
    );
    const user = await createUser('tester', 'testingtester');
    console.info('added: ' + user.username)
    const eventType_q1 = 'INSERT INTO event_types (name) VALUES ($1)';
    await query(eventType_q1, ['viso']);
    const eventType_q2 = 'INSERT INTO event_types (name) VALUES ($1)';
    await query(eventType_q2, ['online']);
    console.info(
      { 
        roles: {
          eventType1: 'viso',
          eventType2: 'online',

        },
        msg: 'eventType added',
      }
    );
    const event_q1 = `
      INSERT INTO
        events (title, text, seats, date, startDate, endDate, location, user_id, event_type_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const event = await query(event_q1, ['test', 'testingTester', 3, new Date().toUTCString(), new Date().toUTCString(), new Date().toUTCString(), 'my house', 1, 1]);
    console.info(event);
  } catch (error) {
    console.error('Villa við að búa til setup');
  }
}

main().catch((err) => {
  console.error(err);
});
