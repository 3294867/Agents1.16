import { db } from './initialize';
import { Agent } from 'src/types';

interface Props {
  userId: string;
}

const getAgents = async ({ userId }: Props): Promise<Agent[]> => {
  try {
    const gettingAgents = await db.agents.where('id').equals(userId).toArray();
    return gettingAgents;
  } catch (error) {
    throw new Error(`Failed to fetch agents (IndexedDB): ${error}`);
  }
};

export default getAgents;