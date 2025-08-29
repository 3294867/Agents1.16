import utils from '..';

const deleteQuery = (threadId: string, requestId: string, responseId: string): string | null => {
  if (!threadId || !requestId || !responseId) {
    return "Missing required fields: threadId, requestId, responseId";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of thread id. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(requestId)) {
    return "Incorrect format of request id. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(responseId)) {
    return "Incorrect format of response id. Expected UUID_V4";
  }

  return null;
};

export default deleteQuery;