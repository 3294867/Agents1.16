import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import openai from 'src/opanai';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Icons from 'src/assets/Icons';
import { Button } from 'src/components/Button';

interface Props {
  userId: string;
  agentId: string;
  agentName: string;
  threadId: string;
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
}

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
    <Button onClick={handleClick} variant='ghost' size='icon' style={{ width: '2rem', height: '2rem' }}>
      <Icons.Move />
    </Button>
  );
};

export default MoveButton;