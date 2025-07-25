import { AgentModel } from 'src/types';

interface Request {
  threadId: string;
  agentModel: AgentModel,
  input: string;
};

/**
 * Creates response.
 * @param {string} props.threadId - Thread id.
 * @param {string} props.agentModel - AI model.
 * @param {string} props.input - Request input.
 * @returns {string} - Response.
*/
const createResponse = async (props: Request): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: props.threadId,
      agentModel: props.agentModel,
      input: props.input
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get response: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: string } = await response.json();
  if (data.data === null) throw new Error(data.message);
  return data.data;
};

export default createResponse;