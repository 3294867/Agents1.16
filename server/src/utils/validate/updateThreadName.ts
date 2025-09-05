import utils from '..';

interface Props {
  threadId: string;
  threadName: string;
}

const updateThreadName = ({ threadId, threadName }: Props): string | null => {
  if (!threadId || !threadName) {
    return "Missing required fields: threadId, threadName";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of threadId. Expected UUID_V4";
  }

  return null;
};

export default updateThreadName;