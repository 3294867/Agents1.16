import { db } from 'src/storage/indexedDB';

/** Initializes IndexedDB with agents and threads object stores. */
const initialize = () => {
  try {
    db.version(4).stores({
      agents: 'id, userId, name, [userId+name], [userId+type]',
      threads: 'id, userId, agentId, title, positionY'
    });
    
  } catch (error) {
    console.error('Failed to initialize indexedDB: ', error);
  }
};

export default initialize;