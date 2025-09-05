import constants from '../../constants';
import { AgentType } from '../../types';

interface Props {
  agentType: AgentType;
}

const getAvailableAgentByType = ({ agentType }: Props): string | null => {
  if (!agentType) {
    return "Missing required fields: agentType";
  }

  if (!constants.data.agentTypes.includes(agentType)) {
    return "Incorrect agentType. Expected: 'general', 'data-analyst', 'copywriter' or 'devops-helper";
  }

  return null;
};

export default getAvailableAgentByType;