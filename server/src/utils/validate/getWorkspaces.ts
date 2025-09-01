import utils from '..';

const getWorkspaces = (userId: string): string | null => {
  if (!userId) {
    return "Missing required fields: userId";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }

  return null;
};

export default getWorkspaces;