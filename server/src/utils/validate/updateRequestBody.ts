import utils from '..';

const updateRequestBody = (requestId: string, requestBody: string): string | null => {
  if (!requestId || !requestBody) {
    return "Missing required fields: requestId, requestBody";
  }

  if (!utils.regex.isUuidV4(requestId)) {
    return "Incorrect format of requestId. Expected UUID_V4";
  }

  return null;
};

export default updateRequestBody;