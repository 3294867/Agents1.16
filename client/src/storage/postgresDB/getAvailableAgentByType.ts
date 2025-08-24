import { Agent, AgentType } from 'src/types';

interface Props {
  agentType: AgentType;
}

const getAvailableAgentByType = async ({ agentType }: Props): Promise<Agent> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-available-agent-by-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch available agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as Agent;
    
  } catch (error) {
    throw new Error(`Failed to fetch available agent (PostgresDB): ${error}`);
  }
};

export default getAvailableAgentByType;