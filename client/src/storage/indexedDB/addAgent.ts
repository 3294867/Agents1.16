import { db } from './initialize';
import { Agent } from 'src/types';

interface Props {
  agent: Agent;
}

const addAgent = async ({ agent }: Props): Promise<void> => {
  try {
    await db.agents.add(agent);
  } catch (error) {
    throw new Error(`Failed to add agent (IndexedDB): ${error}`);
  }
};

export default addAgent;