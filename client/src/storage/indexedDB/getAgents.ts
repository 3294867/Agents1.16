import { db } from 'src/storage/indexedDB';

const getAgents = async () => {
  const gettingAgents = await db.agents.toArray();
  if (!gettingAgents) return null;
  return gettingAgents;
};

export default getAgents;