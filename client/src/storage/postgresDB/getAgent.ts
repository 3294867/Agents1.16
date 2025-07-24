import { Agent } from 'src/types';

interface Props {
  userId: string;
  agentName: string;
};

/** Fetches agent (PostgresDB) */
const getAgent = async ({ userId, agentName }: Props): Promise<Agent> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, agentName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    if (data.data === null) throw new Error(data.message);
    return data.data;
    
  } catch (error) {
    throw new Error(`Failed to fetch agent (PostgresDB): ${error}`);
  }
};

export default getAgent;