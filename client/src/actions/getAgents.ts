import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

const getAgents = async (userId: string): Promise<Agent[] | null> => {
  try {
    const agents = await db.agents.toArray();
    if (agents.length > 0) return agents;
    
    /** Fetch data */
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: { message: string, data: Agent[] | null } = await response.json();
    if (data.data === null) throw new Error(data.message);

    /** Store data */
    await db.agents.bulkPut(data.data);
    return data.data
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default getAgents;