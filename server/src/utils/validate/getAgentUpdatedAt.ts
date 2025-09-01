import utils from '..';

const getAgentUpdatedAt = (agentId: string, ): string | null => {
  if (!agentId) {
    return "Missing required fields: agentId";
  }

  if (!utils.regex.isUuidV4(agentId)) {
    return "Incorrect format of agentId. Expected UUID_V4";
  }

  return null;
};

export default getAgentUpdatedAt;