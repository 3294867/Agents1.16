import { db } from 'src/storage/indexedDB';

/** Initializes IndexedDB with workspaces, agents and threads object stores. */
const initialize = () => {
  try {
    db.version(6).stores({
      workspaces: 'id, name',
      agents: 'id, name',
      threads: 'id, name, positionY'
    });
    
  } catch (error) {
    console.error('Failed to initialize indexedDB: ', error);
  }
};

export default initialize;