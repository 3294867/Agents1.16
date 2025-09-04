import { Agent } from 'src/types';

interface Props {
  workspaceId: string;
  agentName: string;
}

const getAgent = async ({ workspaceId, agentName }: Props): Promise<Agent> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, agentName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect format data in postgresDB.getAgent(). Expected non-empty '{}`);
    }
    
    return data.data as Agent;
  } catch (error) {
    throw new Error(`Failed to fetch agent (PostgresDB): ${error}`);
  }
};

export default getAgent;