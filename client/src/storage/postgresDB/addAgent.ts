import { Agent, AgentType } from 'src/types';

interface Props {
  userId: string;
  agentType: AgentType;
}

const addAgent = async ({ userId, agentType }: Props): Promise<Agent> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/add-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, agentType })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data;
    
  } catch (error) {
    throw new Error(`Failed to add agent (PostgresDB): ${error}`);
  }
};

export default addAgent;