import utils from '..';

const updateThreadName = (threadId: string, threadName: string): string | null => {
  if (!threadId || !threadName) {
    return "Missing required fields: threadId, threadName";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of threadId. Expected UUID_V4";
  }

  return null;
};

export default updateThreadName;