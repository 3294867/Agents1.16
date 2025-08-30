import utils from '..';

const addThread = (userId: string, agentId: string): string | null => {
  if (!userId || !agentId) {
    return "Missing required fields: userId, agentId";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of user id. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(agentId)) {
    return "Incorrect format of agent id. Expected UUID_V4";
  }

  return null;
};

export default addThread;