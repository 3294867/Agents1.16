import utils from '..';

const updateThreadIsBookmarked = (threadId: string, isBookmarked: boolean): string | null => {
  if (!threadId || !isBookmarked) {
    return "Missing required fields: threadId, isBookmarked";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of thread id. Expected UUID_V4";
  }

  return null;
};

export default updateThreadIsBookmarked;