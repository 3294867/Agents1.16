import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import openai from 'src/opanai';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  userId: string;
  agentId: string;
  agentName: string;
  threadId: string;
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
};

const MoveButton = ({ userId, agentId, agentName, threadId, requestId, requestBody, responseId, responseBody }: Props) => {
  const navigate = useNavigate();
  const currentThreadPositionY = hooks.useHandleMoveButton();
  
  const handleClick = async () => {
    /** Update thread body of the current thread (IndexedDB) */
    await indexedDB.deleteQuery({ threadId, requestId });

    /** Update thread body of the current thread  (PostgresDB) */
    await postgresDB.deleteQuery({ threadId, requestId, responseId });
    
    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId,
      positionY: currentThreadPositionY
    });

    /** Create new thread (PostgresDB) */
    const newThreadId = uuidV4();
    const newThread = await postgresDB.createThread({
      id: newThreadId, userId, agentId
    });
    if (!newThread) return;

    /** Add new thread (IndexedDB) */
    const updatedNewThread = { ...newThread, positionY: 0 };
    await indexedDB.addThread({ thread: updatedNewThread });

    /** Add query to the thread body (PostgresDB) */
    const { requestId: newRequestId, responseId: newResponseId } = await postgresDB.addQuery({
      threadId: newThreadId, requestBody, responseBody
    });

    /** Add query to the thread body (IndexedDB) */
    const query ={ requestId: newRequestId, requestBody, responseId: newResponseId, responseBody, isNew: true }
    await indexedDB.addQuery({ threadId: newThreadId, query });

    /** Create thread title (OpenAI) */
    const newThreadTitle = await openai.createThreadTitle({
      question: requestBody,
      answer: responseBody
    });

    /** Update thread title (PostgresDB) */
    await postgresDB.updateThreadTitle({
      threadId: newThreadId,
      threadTitle: newThreadTitle
    });

    /** Update thread title (IndexedDB) */
    await indexedDB.updateThreadTitle({
      threadId: newThreadId,
      threadTitle: newThreadTitle
    });

    /** Add tab (localStorage) */
    tabsStorage.addTab(agentName, {
      id: newThreadId, agentId, title: newThreadTitle, isActive: true
    });
    
    navigate(`/${agentName}/${newThreadId}`);
  };
  
  return (
    <button onClick={handleClick} className='h-8 w-8 text-text-button flex justify-center items-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-border'>
      <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M3 5v14'/><path d='M21 12H7'/><path d='m15 18 6-6-6-6'/></svg>
    </button>
  )
};

export default MoveButton;