import Dexie, { type  EntityTable } from 'dexie';
import { Agent, Thread } from 'src/types';

const db = new Dexie('Agents') as Dexie & {
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const initDB = () => {
  db.version(1).stores({
    agents: 'id, type, model, userId, name, systemInstructions, stack, temperature, webSearch, createdAt, updatedAt',
    threads: 'id, userId, agentId, title, body, isActive, isBookmarked, createdAt, updatedAt'
  });
}

export { db, initDB };