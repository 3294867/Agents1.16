import { QueryResult } from 'pg';
import { pool } from '../..';

const getRootUserId = async (): Promise<QueryResult<any>> => {
  const getRootUserId = await pool.query(`SELECT "id" FROM "User" WHERE "name" = 'Root'::text;`);
  return getRootUserId;
};

export default getRootUserId;