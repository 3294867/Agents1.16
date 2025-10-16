import { AgentModel } from 'src/types';

interface Props {
  agentId: string;
  agentModel: AgentModel;
  input: string;
}

const createStructuredResponse = async ({ agentId, agentModel, input }: Props): Promise<object> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/create-structured-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, agentModel, input })
  });

  if (!response.ok) {
    throw new Error(`Failed to get structured response: ${response.text()}`);
  }

  const body: { message: string, data: object | null } = await response.json();
  if (!body.data) throw new Error(`Failed to get structured response: ${body.message}`);

  return body.data as object;
};

export default createStructuredResponse;