import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Dialog from 'src/components/dialog';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import Heading from 'src/components/heading';
import Paragraph from 'src/components/paragraph';
import styles from './DeleteThreadDialog.module.css';

const DeleteThreadDialog = memo(() => {
  const navigate = useNavigate();
  const { workspaceName, agentName, threadId } = hooks.features.useThreadContext();

  const handleClick = async () => {
    await postgresDB.deleteThread({ threadId });
    await indexedDB.deleteThread({ threadId });
    tabsStorage.remove({ workspaceName, agentName, tabId: threadId });
    navigate(`/${workspaceName}/${agentName}`);
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
          data-workspace-name={workspaceName}
          data-agent-name={agentName}
          data-thread-id={threadId}
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
            <Button onClick={handleClick} style={{ width: 'fit-content' }}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
});

export default DeleteThreadDialog;