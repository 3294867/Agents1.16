import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  agentName: string | undefined;
}

/** Fetches agent (IndexedDB) */
const getAgent = async ({ userId, agentName }: Props): Promise<Agent> => {
  if (!agentName) throw new Error('Agent name is required');

  try {
    const agent = await db.agents.get({userId, name: agentName});
    if (!agent) throw new Error('Agent missing.');
    return agent;
    
  } catch (error) {
    console.error(error);
    throw new Error (`Failed to fetch agent (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getAgent;