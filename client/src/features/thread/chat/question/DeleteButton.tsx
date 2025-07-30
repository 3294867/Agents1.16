import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Button } from 'src/components/Button';
import Icons from 'src/assets/Icons';

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
    /** Update thread body (IndexedDB) */
    await indexedDB.deleteQuery({ threadId, requestId });

    /** Update thread body (PostgresDB) */
    await postgresDB.deleteQuery({ threadId, requestId, responseId });

    if (threadBodyLength == 1) {
      /** Remove thread title (IndexedDB) */
      await indexedDB.removeThreadTitle({ threadId });

      /** Remove thread title (PostgresDB) */
      await postgresDB.removeThreadTitle({ threadId });
      
      /** Remove title from the thread (localStorage) */
      tabsStorage.update(agentName, agentId, threadId, null);

      /** Dispatch threadTitleUpdated event (Events) */
      dispatchEvent.threadTitleUpdated(threadId, null);
    }
  };
  
  return (
    <Button onClick={handleClick} variant='ghost' size='icon' style={{ width: '2rem', height: '2rem' }}>
      <Icons.Delete />
    </Button>
  );
};

export default DeleteButton;