import { db } from 'src/storage/indexedDB';

const initialize = () => {
  db.version(1).stores({
    agents: 'id, userId, name',
    threads: 'id, userId, agentId, title'
  });
};

export default initialize;