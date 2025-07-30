import openai from 'src/opanai';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { AgentModel } from 'src/types';
import Icons from 'src/assets/Icons';

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
      <button onClick={handleRun} className='h-5 w-5 text-text-button cursor-pointer'>
        <Icons.Run />
      </button>
    ) : (
      isNew ? (
        <button onClick={handlePause} className='h-5 w-5 text-text-button cursor-pointer'>
          <Icons.Pause />
        </button>
      ) : (
        null
      )
    );
};

export default PauseRunButton;