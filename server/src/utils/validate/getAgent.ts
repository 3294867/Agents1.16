import utils from '..';

interface Props {
  workspaceId: string;
  agentName: string;
}

const getAgent = ({ workspaceId, agentName }: Props): string | null => {
  if (!workspaceId || !agentName) {
    return "Missing required fields: workspaceId, agentName";
  }

  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  return null;
};

export default getAgent;