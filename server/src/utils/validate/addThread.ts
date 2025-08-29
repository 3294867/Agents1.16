import utils from '..';
import { pool } from '../..';

const addThread = async (userId: string, agentId: string): Promise<string | null> => {
  if (!userId || !agentId) {
    return "Missing required fields: userId, agentId";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of user id. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(agentId)) {
    return "Incorrect format of agent id. Expected UUID_V4";
  }

  const selectedUser = await pool.query(`SELECT id FROM users WHERE id = $1::uuid;`, [ userId ]);
  if (selectedUser.rows.length === 0) return "User does not exist"; 

  const selectedAgent = await pool.query(`SELECT id FROM agents WHERE id = $1::uuid;`, [ agentId ]);
  if (selectedAgent.rows.length === 0) return "Agent does not exist";  

  return null;
};

export default addThread;