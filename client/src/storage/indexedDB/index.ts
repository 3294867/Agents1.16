import Dexie, { type  EntityTable } from 'dexie';
import initialize from 'src/storage/indexedDB/initialize';
import storeAgents from 'src/storage/indexedDB/storeAgents';
import getAgents from 'src/storage/indexedDB/getAgents';
import getAgent from 'src/storage/indexedDB/getAgent';
import getThread from 'src/storage/indexedDB/getThread';
import addQuery from 'src/storage/indexedDB/addQuery';
import updateQueryIsNewFlag from 'src/storage/indexedDB/updateQueryIsNewFlag';
import { Agent, Thread } from 'src/types';

const db = new Dexie('Agents') as Dexie & {
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const indexedDB = {
  initialize,
  storeAgents,
  getAgents,
  getAgent,
  getThread,
  addQuery,
  updateQueryIsNewFlag
};

export { db, indexedDB };