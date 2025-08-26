import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  teamName: string | undefined;
  agentName: string | undefined;
}

const getAgentByName = async ({ userId, teamName, agentName }: Props): Promise<Agent | undefined> => {
  if (!userId || !teamName || !agentName) {
    throw new Error('All props are required: userId, teamName, agentName');
  }

  try {
    const agent = await db.agents.get({userId, teamName, name: agentName});
    return agent;
  } catch (error) {
    throw new Error (`Failed to fetch agent (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getAgentByName;