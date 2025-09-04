import { memo } from 'react';
import openai from 'src/opanai';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import { AgentModel, AgentType } from 'src/types';
import styles from './PauseRunButton.module.css';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
  threadId: string;
  requestId: string;
  responseId: string;
  inferredAgentType: AgentType;
  isNew: boolean;
  input: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const PauseRunButton = memo(({
  workspaceId,
  workspaceName,
  agentId,
  agentName,
  agentModel,
  threadId,
  requestId,
  responseId,
  inferredAgentType,
  isNew,
  input,
  isEditing,
  setIsEditing,
}: Props) => {
  const handlePause = () => {
    setIsEditing(true);
    dispatchEvent.responsePaused(requestId, responseId);
  };

  const handleRun = async () => {
    setIsEditing(false);
    
    const response = await openai.createResponse({ agentId, agentModel, input });
    await postgresDB.updateRequestBody({ requestId, requestBody: input });
    await postgresDB.updateResponseBody({ responseId, responseBody: response });
    const query = {
      requestId,
      requestBody: input,
      responseId,
      responseBody: response,
      isNew: true,
      inferredAgentType
    };
    const queryIndex = await indexedDB.updateQuery({ threadId, query });
    dispatchEvent.queryUpdated(threadId, query);
    
    if (queryIndex === 0) {
      const newThreadName = await openai.createThreadName({ question: input, answer: response});
      await postgresDB.updateThreadName({ threadId, threadName: newThreadName });
      await indexedDB.updateThreadName({ threadId, threadName: newThreadName });
      tabsStorage.update(workspaceId, workspaceName, agentId, agentName, threadId, newThreadName);
      dispatchEvent.threadNameUpdated(threadId, newThreadName);
    }
  };
  
  return (
    <div className={styles.container}>
      {isEditing ? (
        <Button onClick={handleRun} size='icon' variant='outline' style={{ width: '2rem', height: '2rem' }}>
          <Icons.Run />
        </Button>
      ) : (
        isNew ? (
          <Button onClick={handlePause} size='icon' variant='outline' style={{ width: '2rem', height: '2rem' }}>
            <Icons.Pause />
          </Button>
        ) : (
          null
        )
      )}
    </div>
  );
});

export default PauseRunButton;