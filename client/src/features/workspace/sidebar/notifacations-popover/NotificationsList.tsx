import Error from 'src/components/error';
import hooks from 'src/hooks';
import styles from './NotificationsList.module.css';
import WorkspaceInviteNotifications from './WorkspaceInviteNotifications';

const NotificationsList = () => {
  const { userId } = hooks.features.useWorkspaceContext();
  const { notifications, isLoading, error } = hooks.features.useHandleNotifications({ userId });

  if (isLoading) return <Loading />
  if (error || !notifications) return <Error error={error ?? 'Something went wrong. Try again later'} />;

  const workspaceInviteNotifications = notifications.filter(i => i.type === 'workspace_invite')
  
  return (
    <div className={styles.container}>
      <WorkspaceInviteNotifications notifications={workspaceInviteNotifications} />
    </div>
  );
};
NotificationsList.displayName = 'NotificationsList';

export default NotificationsList;

const Loading = () => {
  return (
    <div>
      Loading
    </div>
  )
};