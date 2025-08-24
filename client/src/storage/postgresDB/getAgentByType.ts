import { Agent, AgentType } from 'src/types';

interface Props {
  userId: string;
  agentType: AgentType;
}

const getAgentByType = async ({ userId, agentType }: Props): Promise<Agent | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-agent-by-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, agentType })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    return data.data as Agent;
    
  } catch (error) {
    throw new Error(`Failed to fetch agent (PostgresDB): ${error}`);
  }
};

export default getAgentByType;