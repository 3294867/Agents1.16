import utils from '..';

interface Props {
  workspaceId: string;
}

const getWorkspaceMembers = ({ workspaceId }: Props): string | null => {
  if (!workspaceId) return 'Missing required fields: workspaceId';

  if (!utils.regex.isUuidV4(workspaceId)) {
    return 'Incorrect format of workspaceId. Expected UUID_V4';
  }

  return null;
};

export default getWorkspaceMembers;