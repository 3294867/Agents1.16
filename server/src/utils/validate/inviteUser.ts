import utils from '..';

interface Props {
  userName: string;
  workspaceId: string;
}

const inviteUser = ({ userName, workspaceId }: Props) => {
  if (!userName || !workspaceId ) {
    return 'Missing required fields: userName, workspaceId';
  }

  if (!utils.regex.isUuidV4(workspaceId)) {
    return 'Incorrect format of workspaceId. Expected UUID_V4';
  }

  return null;
};

export default inviteUser;