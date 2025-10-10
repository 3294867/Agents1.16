import Button from 'src/components/button';
import Paragraph from 'src/components/paragraph';
import { Notification } from 'src/types';
import Dropdown from 'src/components/dropdown';
import Icons from 'src/assets/icons';
import styles from './NotificationsList.module.css';
import postgresDB from 'src/storage/postgresDB';
import { toast } from 'sonner';

interface Props {
  notifications: Notification[];
}

const WorkspaceInviteNotifications = ({ notifications }: Props) => {
  const handleAccept = async (notificationId: string) => {
    const acceptInvite = await postgresDB.acceptWorkspaceInvite({ notificationId });
    if (acceptInvite) {
      toast.success('Workspace has been added');
      return;
    }
    toast.error('Something went wrong. Try again later')
  };

  const handleDecline = async (notificationId: string) => {
    const declineInvite = await postgresDB.declineWorkspaceInvite({ notificationId });
    if (declineInvite) {
      toast.success('You have declined an invite');
      return;
    }
    toast.error('Something went wrong. Try again later')
  };

  const handleDismiss = async (notificationId: string) => {
    const dismissInvite = await postgresDB.dismissWorkspaceInvite({ notificationId });
    if (dismissInvite) {
      toast.success('Workspace has been added');
      return;
    }
    toast.error('Something went wrong. Try again later')
  };
  
  return (
    <>
      {notifications.map(i => (
        <div key={i.id} className={styles.item}>
          <Paragraph>{i.message}</Paragraph>
          <div className={styles.buttonsWrapper}>
            <Button
              onClick={() => handleAccept(i.id)}
              variant='outline'
              size='sm'
              style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
              >
              Accept
            </Button>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                >
                  <Icons.ChevronDown />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content side='top' align='end'>
                <Button
                  onClick={() => handleDecline(i.id)}
                  variant='dropdown'
                >
                  Decline
                </Button>
                <Button
                  onClick={() => handleDismiss(i.id)}
                  variant='dropdown'
                >
                  Dismiss
                </Button>
              </Dropdown.Content>
            </Dropdown.Root>
          </div>
        </div>
      ))}
    </>
  );
};

export default WorkspaceInviteNotifications;