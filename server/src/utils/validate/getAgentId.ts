import utils from '..';

interface Props {
  userId: string;
  workspaceName: string;
  agentName: string;
}

const getAgentId = ({ userId, workspaceName, agentName }: Props): string | null => {
  if (!userId || !workspaceName || !agentName ) {
    return "Missing required fields: userId, workspaceName, agentName";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }

  return null;
};

export default getAgentId;