import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Dialog from 'src/components/dialog';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import Heading from 'src/components/heading';
import Paragraph from 'src/components/paragraph';
import styles from './DeleteDialog.module.css';

interface Props {
  threadId: string;
  agentName: string;
}

const DeleteDialog = ({ threadId, agentName }: Props) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    await postgresDB.deleteThread({ threadId });
    await indexedDB.deleteThread({ threadId });
    tabsStorage.deleteTab(agentName, threadId);
    
    navigate(`/${agentName}`);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          id={`delete_thread_button_${threadId}`}
          role='menuitem'
          variant='dropdown'
          className={styles.trigger}
          data-prevent-dropdown-close
          data-thread-id={threadId}
          data-agent-name={agentName}
        >
          <Icons.Delete style={{ marginRight: '0.5rem' }}/>
          Delete
        </Button>
      </Dialog.Trigger>
      <Dialog.Content isNestedInDropdown={true}>
        <div className={styles.container}>
          <Heading variant='h4'>Delete conversation</Heading>
          <Paragraph variant='thin' isMuted={true} className={styles.paragraph}>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </Paragraph>
          <div className={styles.actions}>
            <Dialog.CloseButton />
            <Button onClick={handleClick}>Delete</Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteDialog;