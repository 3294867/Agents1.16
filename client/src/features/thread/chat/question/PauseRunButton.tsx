import openai from 'src/opanai';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import dispatchEvent from 'src/events/dispatchEvent';
import Icons from 'src/assets/Icons';
import { AgentModel } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  input: string;
  isNew: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  agentModel: AgentModel;
}

const PauseRunButton = ({ threadId, requestId, responseId, input, isNew, isEditing, setIsEditing, agentModel }: Props) => {
  const handlePause = () => {
    setIsEditing(true);
    dispatchEvent.responsePaused(requestId);
  };

  const handleRun = async () => {
    setIsEditing(false);
    
    /** Create response (openai) */
    const response = await openai.createResponse({ threadId, agentModel, input });

    /** Update request body (PostgresDB) */
    await postgresDB.updateRequestBody({ requestId, requestBody: input });
    
    /** Update response body (PostgresDB) */
    await postgresDB.updateResponseBody({ responseId, responseBody: response });
    
    /** Update query (IndexedDB) */
    const query = {
      requestId,
      requestBody: input,
      responseId,
      responseBody: response,
      isNew: true
    };
    await indexedDB.updateQuery({ threadId, query });
  };

  return isEditing
    ? (
      <button onClick={handleRun} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}>
        <Icons.Run />
      </button>
    ) : (
      isNew ? (
        <button onClick={handlePause} style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}>
          <Icons.Pause />
        </button>
      ) : (
        null
      )
    );
};

export default PauseRunButton;