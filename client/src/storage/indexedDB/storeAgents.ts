import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  agents: Agent[];
};

/** Saves fetched agents from postgresDB in the indexedDB */
const storeAgents = async ({ agents }: Props): Promise<void> => {
  try {
    await db.agents.bulkPut(agents);
  } catch (error) {
    console.error('Failed to save agents (IndexedDB): ', error);
  }
};

export default storeAgents;