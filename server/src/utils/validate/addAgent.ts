import utils from '..';

const addAgent = (userId: string, workspaceId: string, rootAgentId: string): string | null => {
  if (!userId || !workspaceId || !rootAgentId) {
    return "Missing required fields: userId, workspaceId, rootAgentId";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(rootAgentId)) {
    return "Incorrect format of rootAgentId. Expected UUID_V4";
  }

  return null;
};

export default addAgent;