import { memo } from 'react';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

interface Props {
  workspaceId: string;
  workspaceName: string;
  threadId: string;
  requestId: string;
  responseId: string;
  threadBodyLength: number;
  agentId: string,
  agentName: string,
}

const DeleteButton = memo(({
  workspaceId,
  workspaceName,
  threadId,
  requestId,
  responseId,
  threadBodyLength,
  agentName,
  agentId
}: Props) => {
  const handleClick = async () => {
    /** Update thread body (PostgresDB, IndexedDB) */
    await postgresDB.deleteQuery({ threadId, requestId, responseId });
    await indexedDB.deleteQuery({ threadId, requestId });

    if (threadBodyLength == 1) {
      /** Remove thread name (IndexedDB, PostgresDB, localStorage) */
      await indexedDB.removeThreadName({ threadId });
      await postgresDB.removeThreadName({ threadId });
      tabsStorage.update(workspaceId, workspaceName, agentId, agentName, threadId, null);
      dispatchEvent.threadNameUpdated(threadId, null);
    }
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      <Icons.Delete />
    </Button>
  );
});

export default DeleteButton;