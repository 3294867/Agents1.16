import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import openai from 'src/opanai';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import hooks from 'src/hooks';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import Button from 'src/components/Button';
import { Agent, AgentType } from 'src/types';

interface Props {
  userId: string;
  currentAgentType: AgentType,
  inferredAgentType: AgentType;
  threadId: string;
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
  isEditing: boolean;
}

const ChangeAgentButton = ({
  userId,
  currentAgentType,
  inferredAgentType,
  threadId,
  requestId,
  requestBody,
  responseId,
  responseBody,
  isNew,
  isEditing
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

    /** Load or create new agent */
    let newAgent: Agent | null;
    const savedAgent = await indexedDB.getAgentByType({ userId, agentType: inferredAgentType});
    if (savedAgent) {
      newAgent = savedAgent;
    } else {
      const agentTemplatePostgres = await postgresDB.getAgentTemplate({ agentType: inferredAgentType })
      const agent = {
        id: uuidV4(),
        type: agentTemplatePostgres.type,
        model: agentTemplatePostgres.model,
        userId,
        name: agentTemplatePostgres.name,
        systemInstructions: agentTemplatePostgres.systemInstructions,
        stack: agentTemplatePostgres.stack,
        temperature: agentTemplatePostgres.temperature,
        webSearch: agentTemplatePostgres.webSearch,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const addAgentPostgres: Agent = await postgresDB.addAgent({ agent });
      await indexedDB.addAgent({ agent: addAgentPostgres })
      newAgent = addAgentPostgres
    }
    
    /** Create new thread (PostgresDB) */
    const newThreadId = uuidV4();
    const newThread = await postgresDB.addThread({
      id: newThreadId, userId, agentId: newAgent.id
    });
    if (!newThread) return;

    /** Add new thread (IndexedDB) */
    const updatedNewThread = { ...newThread, positionY: 0 };
    await indexedDB.addThread({ thread: updatedNewThread });

    /** Dispatch agentAdded event (Events) */
    dispatchEvent.agentAdded(newAgent);

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
    tabsStorage.addTab(newAgent.name, {
      id: newThreadId, agentId: newAgent.id, title: newThreadTitle, isActive: true
    });
    
    navigate(`/${newAgent.name}/${newThreadId}`);
  };
  
  const buttonVariant = isEditing ? 'ghost' : isNew ? 'ghost' : 'outline';
  
  return currentAgentType !== inferredAgentType && (
    <Button
      onClick={handleClick}
      size='sm'
      variant={buttonVariant}
      style={{ borderRadius: '999px' }}
    >
      Open in {capitalizeFirstLetter(String(inferredAgentType))} Agent
    </Button>
  )
};

export default ChangeAgentButton;