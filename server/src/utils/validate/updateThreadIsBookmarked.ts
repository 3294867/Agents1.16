import utils from '..';

interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const updateThreadIsBookmarked = ({ threadId, isBookmarked}: Props): string | null => {
  if (!threadId || !isBookmarked) {
    return "Missing required fields: threadId, isBookmarked";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of threadId. Expected UUID_V4";
  }

  return null;
};

export default updateThreadIsBookmarked;