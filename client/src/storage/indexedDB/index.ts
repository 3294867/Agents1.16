import Dexie, { type  EntityTable } from 'dexie';
import initialize from 'src/storage/indexedDB/initialize';
import storeAgents from 'src/storage/indexedDB/storeAgents';
import getAgents from 'src/storage/indexedDB/getAgents';
import getAgent from 'src/storage/indexedDB/getAgent';
import getThread from 'src/storage/indexedDB/getThread';
import addThread from 'src/storage/indexedDB/addThread';
import deleteThread from 'src/storage/indexedDB/deleteThread';
import updateThreadTitle from 'src/storage/indexedDB/updateThreadTitle';
import removeThreadTitle from 'src/storage/indexedDB/removeThreadTitle';
import addQuery from 'src/storage/indexedDB/addQuery';
import updateQuery from 'src/storage/indexedDB/updateQuery';
import deleteQuery from 'src/storage/indexedDB/deleteQuery';
import updateQueryIsNewProp from 'src/storage/indexedDB/updateQueryIsNewProp';
import updateThreadPositionY from 'src/storage/indexedDB/updateThreadPositionY';
import updateThreadIsBookmarked from 'src/storage/indexedDB/updateThreadIsBookmarked';
import pauseResponse from 'src/storage/indexedDB/pauseResponse';
import { Agent, Thread } from 'src/types';
import getFirstQuery from './getFirstQuery';
import updateThread from './updateThread';

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
  addThread,
  deleteThread,
  updateThreadTitle,
  removeThreadTitle,
  addQuery,
  updateQuery,
  deleteQuery,
  updateQueryIsNewProp,
  updateThreadPositionY,
  updateThreadIsBookmarked,
  pauseResponse,
  getFirstQuery,
  updateThread
};

export default indexedDB;

export { db }