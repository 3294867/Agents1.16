import utils from '..';

interface Props {
  requestId: string;
  requestBody: string;
}

const updateRequestBody = ({ requestId, requestBody }: Props): string | null => {
  if (!requestId || !requestBody) {
    return "Missing required fields: requestId, requestBody";
  }

  if (!utils.regex.isUuidV4(requestId)) {
    return "Incorrect format of requestId. Expected UUID_V4";
  }

  return null;
};

export default updateRequestBody;