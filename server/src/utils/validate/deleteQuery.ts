import utils from '..';

const deleteQuery = (requestId: string, responseId: string): string | null => {
  if (!requestId || !responseId) {
    return "Missing required fields: requestId, responseId";
  }

  if (!utils.regex.isUuidV4(requestId)) {
    return "Incorrect format of requestId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(responseId)) {
    return "Incorrect format of responseId. Expected UUID_V4";
  }

  return null;
};

export default deleteQuery;