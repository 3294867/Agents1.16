import utils from '..';

interface Props {
  notificationId: string;
}

const acceptWorkspaceInvite = ({ notificationId }: Props): string | null => {
  if (!notificationId) {
    return 'Missing required fields: notificationId';
  }

  if (!utils.regex.isUuidV4(notificationId)) {
    return 'Incorrect format of notificationId. Expected UUID_V4';
  }

  return null;
};

export default acceptWorkspaceInvite;