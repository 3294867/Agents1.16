import { QueryResult } from 'pg';
import { pool } from '..';

const selectedThread = async (threadId: string): Promise<QueryResult<any>> => {
  const result = await pool.query(`SELECT * FROM threads WHERE id = $1::uuid;`, [ threadId ] );

  if (result.rows.length > 0 && result.rows[0].body) {
    result.rows[0].body = Array.isArray(result.rows[0].body)
      ? result.rows[0].body
      : JSON.parse(result.rows[0].body);
  }

  return result;
};

export default selectedThread;
