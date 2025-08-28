import utils from '..';
import { Agent } from '../../types';

const addAgent = (agent: Agent): string | null => {
  if (!agent.userId || !agent.workspaceId || !agent.name) {
    return "Missing required fields: userId, workspaceId, name";
  }

  if (!utils.regex.isUuidV4(agent.userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(agent.workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  return null;
};

export default addAgent;