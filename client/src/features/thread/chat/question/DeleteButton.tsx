import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';

interface Props {
  teamId: string;
  teamName: string;
  threadId: string;
  requestId: string;
  responseId: string;
  threadBodyLength: number;
  agentId: string,
  agentName: string,
}

const DeleteButton = ({
  teamId,
  teamName,
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
      tabsStorage.update(teamId, teamName, agentName, agentId, threadId, null);
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