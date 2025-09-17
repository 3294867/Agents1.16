import constants from '../../constants';
import { AgentType } from '../../types'

interface Props {
  agentType: AgentType;
}

const getAgentByType = ({ agentType }: Props) => {
  if (!agentType) {
    return 'Missing required fields: agentType';
  }

  if (!constants.data.agentTypes.includes(agentType)) {
    return `Incorrect format of agentType. Expected: 'general', 'data-analyst', 'copywriter', 'devops-helper'`
  }
};

export default getAgentByType;