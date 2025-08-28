import { QueryResult } from 'pg';
import { pool } from '../..';

const selectedRootUserId = async (): Promise<QueryResult<any>> => {
  const result = await pool.query(`SELECT id FROM users WHERE name = 'Root'::text;`);
  return result;
};

export default selectedRootUserId;