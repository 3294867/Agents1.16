import utils from '..';

interface Props {
  userId: string;
  workspaceName: string;
}

const getWorkspaceId = ({ userId, workspaceName }: Props): string | null => {
  if (!userId || !workspaceName) {
    return "Missing required fields: userId, workspaceName";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected: UUID_V4";
  }

  return null;
};

export default getWorkspaceId;