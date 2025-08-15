import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  threadBodyLength: number;
  agentId: string,
  agentName: string,
}

const DeleteButton = ({
  threadId,
  requestId,
  responseId,
  threadBodyLength,
  agentName,
  agentId
}: Props) => {
  const handleClick = async () => {
    /** Update thread body (PostgresDB, IndexedDB) */
    await indexedDB.deleteQuery({ threadId, requestId });
    await postgresDB.deleteQuery({ threadId, requestId, responseId });

    if (threadBodyLength == 1) {
      /** Remove thread title (IndexedDB, PostgresDB, localStorage) */
      await indexedDB.removeThreadTitle({ threadId });
      await postgresDB.removeThreadTitle({ threadId });
      tabsStorage.update(agentName, agentId, threadId, null);

      /** Dispatch threadTitleUpdated event (Events) */
      dispatchEvent.threadTitleUpdated(threadId, null);
    }
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      <Icons.Delete />
    </Button>
  );
};

export default DeleteButton;