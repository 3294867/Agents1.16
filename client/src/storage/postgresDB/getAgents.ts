import { Agent } from 'src/types';

interface Props {
  userId: string;
};

/**
 * Fetches agents for a specific user (PostgresDB).
 * @param {string} props.userId - The ID of the user.
 * @returns {Promise<Agent[] | null>} - Returns an array of agents.
*/
const getAgents = async ({ userId }: Props): Promise<Agent[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agents (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent[] | null } = await response.json();
    if (data.data === null) throw new Error(data.message);
    return data.data;
    
  } catch (error) {
    throw new Error(`Failed to fetch agents (PostgresDB): ${error}`);
  }
};

export default getAgents;