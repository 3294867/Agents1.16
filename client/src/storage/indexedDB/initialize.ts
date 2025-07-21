import { db } from 'src/storage/indexedDB';

/** Initializes IndexedDB with agents and threads object stores. */
const initialize = () => {
  try {
    db.version(2).stores({
      agents: 'id, userId, name',
      threads: 'id, userId, agentId, title, positionY'
    });
    
  } catch (error) {
    console.error('Failed to initialize indexedDB', error);
  }
};

export default initialize;