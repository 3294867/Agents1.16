import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import openai from 'src/opanai';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Button from 'src/components/Button';
import Icons from 'src/assets/icons';
import { AgentType } from 'src/types';

interface Props {
  userId: string;
  agentId: string;
  agentName: string;
  threadId: string;
  threadBodyLength: number;
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

const MoveButton = ({
  userId,
  agentId,
  agentName,
  threadId,
  threadBodyLength,
  requestId,
  requestBody,
  responseId,
  responseBody,
  inferredAgentType
}: Props) => {
  const navigate = useNavigate();
  const currentThreadPositionY = hooks.useHandleThreadPostionY();
  
  const handleClick = async () => {
    /** Remove query from the 'body' property of the current thread (IndexedDB, PostgresDB) */
    await indexedDB.deleteQuery({ threadId, requestId });
    await postgresDB.deleteQuery({ threadId, requestId, responseId });
    
    /** Create and update 'title' property of the thread (OpenAI, IndexedDB, PostgresDB) */
    const firstQuery = await indexedDB.getFirstQuery({ threadId });
    if (firstQuery) {
      const threadTitle = await openai.createThreadTitle({
        question: firstQuery.requestBody,
        answer: firstQuery.responseBody
      }) 

      await postgresDB.updateThreadTitle({
        threadId, threadTitle
      });
      
      await indexedDB.updateThreadTitle({
        threadId, threadTitle
      });      
    } else {
      await postgresDB.updateThreadTitle({
        threadId, threadTitle: null
      });

      await indexedDB.updateThreadTitle({
        threadId, threadTitle: null
      });  
    }

    /** Update 'positionY' property of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId,
      positionY: currentThreadPositionY
    });

    /** Create new thread (PostgresDB) */
    const newThreadId = uuidV4();
    const newThread = await postgresDB.addThread({
      id: newThreadId, userId, agentId
    });
    if (!newThread) return;

    /** Add new thread (IndexedDB) */
    const updatedNewThread = { ...newThread, positionY: 0 };
    await indexedDB.addThread({ thread: updatedNewThread });

    /** Add query to the 'body' property of the new thread (IndexedDB, PostgresDB) */
    const { requestId: newRequestId, responseId: newResponseId } = await postgresDB.addQuery({
      threadId: newThreadId, requestBody, responseBody
    });
    const query ={
      requestId: newRequestId,
      requestBody,
      responseId: newResponseId,
      responseBody,
      isNew: true,
      inferredAgentType
    }
    await indexedDB.addQuery({ threadId: newThreadId, query });

    /** Create and update 'title' property of the new thread (OpenAI, PostgresDB, IndexedDB) */
    const newThreadTitle = await openai.createThreadTitle({
      question: requestBody,
      answer: responseBody
    });
    await postgresDB.updateThreadTitle({
      threadId: newThreadId,
      threadTitle: newThreadTitle
    });
    await indexedDB.updateThreadTitle({
      threadId: newThreadId,
      threadTitle: newThreadTitle
    });

    /** Add tab for the new thread (localStorage) */
    tabsStorage.addTab(agentName, {
      id: newThreadId, agentId, title: newThreadTitle, isActive: true
    });
    
    navigate(`/${agentName}/${newThreadId}`);
  };
  
  return threadBodyLength > 1 && (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      <Icons.Move />
    </Button>
  );
};

export default MoveButton;