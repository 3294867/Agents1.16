import { AgentType } from 'src/types';

interface Props {
  input: string;
}

const inferAgentType = async ({ input }: Props): Promise<AgentType> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/infer-agent-type`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to evaluate agent: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: AgentType } = await response.json();
  if (data.data === null) throw new Error(`Failed to infer agent type: ${data.message}`);
  return data.data;
};

export default inferAgentType;