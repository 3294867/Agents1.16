import utils from '..';
import constants from '../../constants';
import { AgentType } from '../../types';

const getAvailableAgentByType = (agentType: AgentType, ): string | null => {
  if (!agentType) {
    return "Missing required fields: agentType";
  }

  if (!constants.data.agentTypes.includes(agentType)) {
    return "Incorrect agentType. Expected: 'general', 'data-analyst', 'copywriter' or 'devops-helper";
  }

  return null;
};

export default getAvailableAgentByType;