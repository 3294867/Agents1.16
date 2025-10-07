import utils from '..';

interface Props {
  workspaceId: string;
  userId: string;
  role: string;
}

const updateMemberRole = ({ workspaceId, userId, role }: Props): string | null => {
  if (!workspaceId || !userId || !role) {
    return "Missing required fields: workspaceId, userId, role";
  }
  
  if (!utils.regex.isUuidV4(workspaceId)) {
    return "Incorrect format of workspaceId. Expected UUID_V4";
  }

  if (!utils.regex.isUuidV4(userId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }
  
  return null;
};

export default updateMemberRole;