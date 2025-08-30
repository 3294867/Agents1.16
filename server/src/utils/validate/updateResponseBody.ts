import utils from '..';

const updateResponseBody = (responseId: string, responseBody: string): string | null => {
  if (!responseId || !responseBody) {
    return "Missing required fields: responseId, responseBody";
  }

  if (!utils.regex.isUuidV4(responseId)) {
    return "Incorrect format of response id. Expected UUID_V4";
  }

  return null;
};

export default updateResponseBody;