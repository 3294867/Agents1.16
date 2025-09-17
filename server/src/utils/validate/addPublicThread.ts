import utils from '..';
import { pool } from '../..';

interface Props {
  threadId: string;
}

const addPublicThread = async ({ threadId }: Props): Promise<string | null> => {
  if (!threadId) {
    return "Missing required fields: threadId";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of threadId. Expected UUID_V4";
  }

  const selectedThreadId = await pool.query(`
    SELECT id
    FROM threads
    WHERE id = $1::uuid;
  `, [ threadId ]);
  if (selectedThreadId.rows.length === 0) return "Thread does not exist";

  return null;
};

export default addPublicThread;