import utils from '..';

interface Props {
  threadId: string;
}

const getThread = ({ threadId }: Props): string | null => {
  if (!threadId) {
    return "Missing required fields: threadId";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of threadId. Expected UUID_V4";
  }

  return null;
};

export default getThread;