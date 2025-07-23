import Dexie, { type  EntityTable } from 'dexie';
import initialize from 'src/storage/indexedDB/initialize';
import storeAgents from 'src/storage/indexedDB/storeAgents';
import addThread from 'src/storage/indexedDB/addThread';
import getAgents from 'src/storage/indexedDB/getAgents';
import getAgent from 'src/storage/indexedDB/getAgent';
import getThread from 'src/storage/indexedDB/getThread';
import updateThreadTitle from 'src/storage/indexedDB/updateThreadTitle';
import addQuery from 'src/storage/indexedDB/addQuery';
import updateQuery from 'src/storage/indexedDB/updateQuery';
import updateQueryIsNewProp from 'src/storage/indexedDB/updateQueryIsNewProp';
import updateThreadPositionY from 'src/storage/indexedDB/updateThreadPositionY';
import pauseResponse from 'src/storage/indexedDB/pauseResponse';
import { Agent, Thread } from 'src/types';

const db = new Dexie('Agents') as Dexie & {
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const indexedDB = {
  initialize,
  storeAgents,
  addThread,
  getAgents,
  getAgent,
  getThread,
  updateThreadTitle,
  addQuery,
  updateQuery,
  updateQueryIsNewProp,
  updateThreadPositionY,
  pauseResponse
};

export default indexedDB;

export { db }