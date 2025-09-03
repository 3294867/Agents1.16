import { db } from './initialize';
import { Agent } from 'src/types';

interface Props {
  workspaceId: string;
  agentName: string;
}

const getAgent = async ({ workspaceId, agentName,  }: Props): Promise<Agent | undefined> => {
  try {
    const getAgent = await db.agents.get({name: agentName, workspaceId});
    return getAgent;
  } catch (error) {
    throw new Error(`Failed to fetch agent (IndexedDB): ${error}`);
  }
};

export default getAgent;