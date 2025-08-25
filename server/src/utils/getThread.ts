import { QueryResult } from 'pg';
import { pool } from '../..';

const getThread = async (threadId: string): Promise<QueryResult<any>> => {
  const getThread = await pool.query(`SELECT * FROM "Thread" WHERE "id" = $1::uuid;`, [ threadId ]);
  return getThread;
};

export default getThread;