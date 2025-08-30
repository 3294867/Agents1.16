import utils from '..';

const getWorkspaceId = (userId: string, workspaceName: string ): string | null => {
  if (!userId || !workspaceName) {
    return "Missing required fields: userId, workspaceName";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of user id. Expected: UUID_V4";
  }

  return null;
};

export default getWorkspaceId;