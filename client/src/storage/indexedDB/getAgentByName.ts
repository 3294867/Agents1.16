import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  agentName: string | undefined;
}

const getAgentByName = async ({ userId, agentName }: Props): Promise<Agent | undefined> => {
  if (!agentName) throw new Error('Agent name is required');

  try {
    const agent = await db.agents.get({userId, name: agentName});
    return agent;
  } catch (error) {
    throw new Error (`Failed to fetch agent (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getAgentByName;