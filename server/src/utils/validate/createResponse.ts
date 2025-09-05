import utils from '..';
import constants from '../../constants';
import { AgentModel } from '../../types';

interface Props {
  agentId: string;
  input: string;
  agentModel?: AgentModel;
}

const createResponse = async ({ agentId, input, agentModel }: Props): Promise<string | null> => {
  if (!agentId || !input) {
    return "Missing required fields: agentId, input";
  }

  if (!utils.regex.isUuidV4(agentId)) {
    return "Incorrect format of agentId. Expected UUID_V4";
  }

  if (agentModel && !constants.data.agentModels.includes(agentModel)) {
    return "Incorrect agentModel. Expected: 'gpt-3.5-turbo', 'gpt-4.1', 'gpt-4o', 'gpt-4o-audio-preview' or 'chatgpt-4o'";
  }

  return null;
};

export default createResponse;