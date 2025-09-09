import { Store } from 'express-session';
import { pool } from '.';
import utils from './utils';

export class CustomPGSessionStore extends Store {
  async get(sid: string, callback: (err: any, session?: any) => void) {
    try {
      const result = await pool.query(`
        SELECT data
        FROM sessions
        WHERE sid = $1::text
          AND expires > NOW();
      `,[ sid ]);
      if (result.rows.length === 0) return callback(null, null);
      const encryptedData = result.rows[0].data;
      const decryptedData = JSON.parse(utils.decrypt(encryptedData.encrypted));
      callback(null, decryptedData);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid: string, session: any, callback: (err?: any) => void) {
    const expires = new Date(session.cookie.expires);
    const userId = session.userId;
    if (!userId) return callback(new Error('No userId in session'));

    try {
      const encryptedData = utils.encrypt(JSON.stringify(session));
      await pool.query(
        `INSERT INTO sessions (sid, user_id, data, expires)
         VALUES ($1::text, $2::uuid, $3::jsonb, $4::timestamp)
         ON CONFLICT (sid) DO UPDATE
         SET data = EXCLUDED.data, expires = EXCLUDED.expires;
        `, [ sid, userId, { encrypted: encryptedData }, expires ]
      );
      callback();
    } catch (err) {
      callback(err);
    }
  }

  async destroy(sid: string, callback: (err?: any) => void) {
    try {
      await pool.query(`
        DELETE
        FROM sessions 
        WHERE sid = $1::text;
      `, [ sid ]);
      callback();
    } catch (err) {
      callback(err);
    }
  }

  async touch(sid: string, session: any, callback: (err?: any) => void) {
    try {
      const expires = new Date(session.cookie.expires);
      await pool.query(`
        UPDATE sessions
        SET expires = $1::timestamp
        WHERE sid = $2::text;
      `, [ expires, sid ]);
      callback();
    } catch (err) {
      callback(err);
    }
  }
};