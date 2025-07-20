import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

/**
 * Fetches all agents (IndexedDB).
 * @returns {Promise<Agent[] | null>} - Returns array of agents or null.
 */
const getAgents = async (): Promise<Agent[] | null> => {
  try {
    const gettingAgents = await db.agents.toArray();
    if (!gettingAgents) return null;
    return gettingAgents;
    
  } catch (error) {
    console.error('Failed to fetch agents (IndexedDB): ', error);
    return null;
  }
};

export default getAgents;