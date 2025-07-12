import { db } from 'src/storage/indexedDB';

const initialize = () => {
  db.version(1).stores({
    agents: 'id, type, model, userId, name, systemInstructions, stack, temperature, webSearch, createdAt, updatedAt',
    threads: 'id, userId, agentId, title, body, isActive, isBookmarked, createdAt, updatedAt'
  });
};

export default initialize;