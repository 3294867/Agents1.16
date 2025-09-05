import utils from '..';
import { pool } from '../..';

interface Props {
  userId: string;
  workspaceId: string;
  publicThreadId: string;
}

const duplicateThread = async ({ userId, workspaceId, publicThreadId }: Props): Promise<string | null> => {
  if (!userId || !workspaceId || !publicThreadId) {
    return "Missing required fields: userId, workspaceId, publicThreadId";
  }
  
  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }
  
  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(publicThreadId)) {
    return "Incorrect format of publicThreadId. Expected UUID_V4";
  }
  
  const selectedUserId = await pool.query(`
    SELECT id
    FROM users
    WHERE id = $1::uuid
  `, [ userId ]);
  if (selectedUserId.rows.length === 0) return "User does not exist";
  
  const selectedWorkspaceId = await pool.query(`
    SELECT id
    FROM workspaces
    WHERE id = $1::uuid
  `, [ workspaceId ]);
  if (selectedWorkspaceId.rows.length === 0) return "Workspace does not exist";

  const selectedPublicThreadId = await pool.query(`
    SELECT id
    FROM threads
    WHERE id = $1::uuid
  `, [ publicThreadId ]);
  if (selectedPublicThreadId.rows.length === 0) return "Thread does not exist";
  
  return null;
};

export default duplicateThread;