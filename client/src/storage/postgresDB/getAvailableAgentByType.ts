import { AddAgent, AgentType } from 'src/types';

interface Props {
  agentType: AgentType;
}

const getAvailableAgentByType = async ({ agentType }: Props): Promise<AddAgent> => {
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
    
    const data: { message: string, data: AddAgent | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect format od available agent. Expected non-empty '{}'`);
    }
    
    return data.data as AddAgent;
  } catch (error) {
    throw new Error(`Failed to fetch available agent by type (PostgresDB): ${error}`);
  }
};

export default getAvailableAgentByType;