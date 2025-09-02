import utils from '..';
import { AddAgent } from '../../types';

const addAgent = (workspaceId: string, agentData: AddAgent): string | null => {
  if (!workspaceId || Object.keys(agentData).length === 0) {
    return "Missing required fields: userId, workspaceId, agentData";
  }

  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  return null;
};

export default addAgent;