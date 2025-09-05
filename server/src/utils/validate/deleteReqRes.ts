import utils from '..';

interface Props {
  requestId: string;
  responseId: string;
}

const deleteReqRes = ({ requestId, responseId }: Props): string | null => {
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

export default deleteReqRes;