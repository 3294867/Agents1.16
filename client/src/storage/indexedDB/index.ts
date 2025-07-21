import Dexie, { type  EntityTable } from 'dexie';
import initialize from 'src/storage/indexedDB/initialize';
import storeAgents from 'src/storage/indexedDB/storeAgents';
import getAgents from 'src/storage/indexedDB/getAgents';
import getAgent from 'src/storage/indexedDB/getAgent';
import getThread from 'src/storage/indexedDB/getThread';
import updateThreadTitle from './updateThreadTitle';
import addQuery from 'src/storage/indexedDB/addQuery';
import updateQueryIsNewProp from 'src/storage/indexedDB/updateQueryIsNewProp';
import updateThreadPositionY from './updateThreadPositionY';
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
  updateThreadTitle,
  addQuery,
  updateQueryIsNewProp,
  updateThreadPositionY,
};

export default indexedDB;

export { db }