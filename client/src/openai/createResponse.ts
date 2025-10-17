import { AgentModel } from 'src/types';

interface Props {
  agentId: string;
  agentModel: AgentModel,
  input: string;
}

const createResponse = async ({ agentId, agentModel, input }: Props): Promise<{ type: string, output: string}> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/create-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, agentModel, input })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get response: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const body: { message: string, data: { type: string, output: string} | null } = await response.json();
    if (!body.data) throw new Error(body.message);
    
    return body.data;
  } catch (error) {
    throw new Error(`Failed to create response (openAI): ${error}`);
  }
};

export default createResponse;