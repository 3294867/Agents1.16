import Dexie, { type  EntityTable } from 'dexie';
import initialize from 'src/storage/indexedDB/initialize';
import storeAgents from 'src/storage/indexedDB/storeAgents';
import getAgents from 'src/storage/indexedDB/getAgents';
import getAgentByName from 'src/storage/indexedDB/getAgentByName';
import getAgentByType from 'src/storage/indexedDB/getAgentByType';
import addAgent from 'src/storage/indexedDB/addAgent';
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
import getFirstQuery from 'src/storage/indexedDB/getFirstQuery';
import updateThread from 'src/storage/indexedDB/updateThread';
import { Agent, Thread } from 'src/types';

const db = new Dexie('Agents') as Dexie & {
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const indexedDB = {
  initialize,
  storeAgents,
  getAgents,
  getAgentByName,
  getAgentByType,
  addAgent,
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

export { db };