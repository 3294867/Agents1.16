import { db } from './initialize';
import { Agent } from 'src/types';

interface Props {
  agents: Agent[];
}

const addAgents = async ({ agents }: Props): Promise<void> => {
  try {
    await db.agents.bulkPut(agents);
  } catch (error) {
    console.error('Failed to add agents (IndexedDB): ', error);
  }
};

export default addAgents;