import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  threadBodyLength: number;
  agentId: string,
  agentName: string,
};

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
    <button onClick={handleClick} className='h-8 w-8 text-text-button flex justify-center items-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-border'>
      <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg>
    </button>
  )
};

export default DeleteButton;