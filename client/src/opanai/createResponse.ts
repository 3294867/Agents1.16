import { AgentModel } from 'src/types';

interface Props {
  agentId: string;
  agentModel: AgentModel,
  input: string;
}

const createResponse = async ({ agentId, agentModel, input }: Props): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, agentModel, input })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get response: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: string } = await response.json();
  if (data.data === null) throw new Error(`Failed to get response: ${data.message}`);
  return data.data;
};

export default createResponse;