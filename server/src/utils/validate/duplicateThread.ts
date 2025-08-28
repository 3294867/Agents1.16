import utils from '..';
import { pool } from '../..';

const duplicateThread = async (publicThreadId: string, userId: string, workspaceId: string): Promise<string | null> => {
  if (!publicThreadId || !userId || !workspaceId) {
    return "Missing required fields: publicThreadId, userId, agentId, workspaceId";
  }

  if (!utils.regex.isUuidV4(publicThreadId)) {
    return "Incorrect format of publicThreadId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  const selectedPublicThreadId = await pool.query(`SELECT id FROM threads WHERE id = $1::uuid`, [ publicThreadId ]);
  if (selectedPublicThreadId.rows.length === 0) return "Thread does not exist";

  const selectedUserId = await pool.query(`SELECT id FROM users WHERE id = $1::uuid`, [ userId ]);
  if (selectedUserId.rows.length === 0) return "User does not exist";
  
  const selectedWorkspaceId = await pool.query(`SELECT id FROM workspaces WHERE id = $1::uuid`, [ workspaceId ]);
  if (selectedWorkspaceId.rows.length === 0) return "Workspace does not exist";
  
  return null;
};

export default duplicateThread;