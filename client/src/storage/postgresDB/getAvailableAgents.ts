import { Agent } from 'src/types';

const getAvailableAgents = async (): Promise<Agent[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-available-agents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch available agents (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as Agent[];
    
  } catch (error) {
    throw new Error(`Failed to fetch available agents (PostgresDB): ${error}`);
  }
};

export default getAvailableAgents;