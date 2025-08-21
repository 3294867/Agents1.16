import openai from 'src/opanai';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/icons';
import { AgentModel, AgentType } from 'src/types';
import styles from './PauseRunButton.module.css';
import Button from 'src/components/button';

interface Props {
  threadId: string;
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
  requestId: string;
  responseId: string;
  input: string;
  isNew: boolean;
  inferredAgentType: AgentType;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const PauseRunButton = ({
  threadId,
  agentId,
  agentName,
  agentModel,
  requestId,
  responseId,
  input,
  isNew,
  inferredAgentType,
  isEditing,
  setIsEditing,
}: Props) => {
  const handlePause = () => {
    setIsEditing(true);
    dispatchEvent.responsePaused(requestId);
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
      const newThreadTitle = await openai.createThreadTitle({ question: input, answer: response});
      await postgresDB.updateThreadTitle({ threadId, threadTitle: newThreadTitle });
      await indexedDB.updateThreadTitle({ threadId, threadTitle: newThreadTitle });
      tabsStorage.update(agentName, agentId, threadId, newThreadTitle);
      dispatchEvent.threadTitleUpdated(threadId, newThreadTitle);
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
};

export default PauseRunButton;