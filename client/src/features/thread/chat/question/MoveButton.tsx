import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import openai from 'src/openai';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import { AgentType } from 'src/types';

interface Props {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

const MoveButton = memo(({
  requestId,
  requestBody,
  responseId,
  responseBody,
  inferredAgentType
}: Props) => {
  const navigate = useNavigate();
  const {
    workspaceId,
    workspaceName,
    agentId,
    agentName,
    threadId,
    threadBodyLength,
    threadPositionY
  } = hooks.features.useThreadContext();
  
  const handleClick = async () => {
    /** Remove reqres from the 'body' property of the current thread (IndexedDB, PostgresDB) */
    await indexedDB.deleteReqRes({ threadId, requestId });
    await postgresDB.deleteReqRes({ threadId, requestId, responseId });
    
    /** Create and update 'title' property of the thread (OpenAI, IndexedDB, PostgresDB, localStorage) */
    const firstReqRes = await indexedDB.getFirstReqRes({ threadId });
    if (firstReqRes) {
      const threadName = await openai.createThreadName({
        question: firstReqRes.requestBody,
        answer: firstReqRes.responseBody
      });
      await postgresDB.updateThreadName({ threadId, threadName });
      await indexedDB.updateThreadName({ threadId, threadName });
      tabsStorage.updateName({ workspaceName, agentName, tabId: threadId, tabName: threadName });
    } else {
      await postgresDB.updateThreadName({ threadId, threadName: null });
      await indexedDB.updateThreadName({ threadId, threadName: null });  
      tabsStorage.updateName({ workspaceName, agentName, tabId: threadId, tabName: null });
    }

    /** Update 'positionY' property of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({ threadId, positionY: threadPositionY });

    /** Create new thread (PostgresDB) */
    const newThread = await postgresDB.addThread({ agentId });
    if (!newThread) return;

    /** Add new thread (IndexedDB) */
    await indexedDB.addNewThread({ id: newThread.id, agentId, createdAt: newThread.createdAt, updatedAt: newThread.updatedAt });

    /** Add reqres to the 'body' property of the new thread (IndexedDB, PostgresDB) */
    const { requestId: newRequestId, responseId: newResponseId } = await postgresDB.addReqRes({
      threadId: newThread.id, requestBody, responseBody
    });
    const reqres ={
      requestId: newRequestId,
      requestBody,
      responseId: newResponseId,
      responseBody,
      inferredAgentType,
      isNew: true
    }
    await indexedDB.addReqRes({ threadId: newThread.id, reqres });

    /** Create and update 'name' property of the new thread (OpenAI, PostgresDB, IndexedDB) */
    const newThreadName = await openai.createThreadName({ question: requestBody, answer: responseBody });
    await postgresDB.updateThreadName({ threadId: newThread.id, threadName: newThreadName });
    await indexedDB.updateThreadName({ threadId: newThread.id, threadName: newThreadName });

    /** Add tab for the new thread (localStorage) */
    tabsStorage.add({ workspaceName, agentName, newTab: {
      id: newThread.id, workspaceId, agentId, name: newThreadName, isActive: true
    }});
    
    navigate(`/${workspaceName}/${agentName}/${newThread.id}`);
  };
  
  return threadBodyLength > 1 && (
    <Button onClick={handleClick} variant='ghost' size='icon'>
      <Icons.Move />
    </Button>
  );
});

export default MoveButton;