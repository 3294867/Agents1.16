import utils from '..';

const deleteThread = (threadId: string): string | null => {
  if (!threadId) {
    return "Missing required fields: threadId";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of user id. Expected UUID_V4";
  }

  return null;
};

export default deleteThread;