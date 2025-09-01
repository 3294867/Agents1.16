import utils from '..';

const getWorkspaceAgents = (workspaceId: string): string | null => {
  if (!workspaceId) {
    return "Missing required fields: workspaceId";
  }

  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  return null;
};

export default getWorkspaceAgents;