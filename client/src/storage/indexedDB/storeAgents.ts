import { db } from 'src/storage/indexedDB';
import { Agent } from 'src/types';

const storeAgents = async (data: Agent[]) => {
  await db.agents.bulkPut(data);
};

export default storeAgents;