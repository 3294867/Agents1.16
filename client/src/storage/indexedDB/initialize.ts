import Dexie, { EntityTable } from 'dexie';
import { Agent, Thread, Workspace } from 'src/types';

export const db = new Dexie('Agents') as Dexie & {
  workspaces: EntityTable<Workspace, 'id'>,
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const initialize = () => {
  try {
    db.version(6).stores({
      workspaces: 'id, name, updatedAt',
      agents: 'id, name, type, workspaceId, updatedAt, [name+workspaceId]',
      threads: 'id, agentId, positionY, updatedAt'
    });
    
  } catch (error) {
    console.error('Failed to initialize indexedDB: ', error);
  }
};

export default initialize;