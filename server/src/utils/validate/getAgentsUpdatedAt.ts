import utils from '..';

const getAgentsUpdatedAt = (userId: string, ): string | null => {
  if (!userId) {
    return "Missing required fields: userId";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of user id. Expected UUID_V4";
  }

  return null;
};

export default getAgentsUpdatedAt;