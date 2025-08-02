import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

/** Fetches agents (IndexedDB) */
const getAgents = async (): Promise<Agent[]> => {
  try {
    const gettingAgents = await db.agents.toArray();
    return gettingAgents;
    
  } catch (error) {
    console.error('Failed to fetch agents (IndexedDB): ', error);
    return [];
  }
};

export default getAgents;