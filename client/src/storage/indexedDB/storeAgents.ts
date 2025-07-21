import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  agents: Agent[];
};

/**
 * Saves fetched agents from postgresDB in the indexedDB.
 * @param {Agent[]} props.agents - Array of agents.
 * @returns {Promise<void>} - Does not have a return value.
 */
const storeAgents = async ({ agents }: Props): Promise<void> => {
  try {
    await db.agents.bulkPut(agents);
  } catch (error) {
    console.error('Failed to save agents (IndexedDB): ', error);
  }
};

export default storeAgents;