import { db } from 'src/storage/indexedDB';

/** Initializes IndexedDB with teams, agents and threads object stores. */
const initialize = () => {
  try {
    db.version(5).stores({
      teams: 'id, name, [userId+name]',
      agents: 'id, userId, name, [userId+name], [userId+type], [userId+teamName+name]',
      threads: 'id, userId, agentId, title, positionY'
    });
    
  } catch (error) {
    console.error('Failed to initialize indexedDB: ', error);
  }
};

export default initialize;