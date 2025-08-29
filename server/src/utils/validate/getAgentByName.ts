import utils from '..';

const getAgentByName = (userId: string): string | null => {
  if (!userId) {
    return "Missing required fields: userId";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of user id. Expected UUID_V4";
  }

  return null;
};

export default getAgentByName;