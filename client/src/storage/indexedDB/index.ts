import Dexie, { type  EntityTable } from 'dexie';
import initialize from 'src/storage/indexedDB/initialize';
import addWorkspaces from 'src/storage/indexedDB/addWorkspaces';
import addAgents from 'src/storage/indexedDB/storeAgents';
import getAgents from 'src/storage/indexedDB/getAgents';
import getWorkspaceId from 'src/storage/indexedDB/getWorkspaceId';
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
import getWorkspaces from 'src/storage/indexedDB/getWorkspaces';
import getAgentId from 'src/storage/indexedDB/getAgentId';
import getAgent from 'src/storage/indexedDB/getAgent';
import { Workspace, Agent, Thread } from 'src/types';

const db = new Dexie('Agents') as Dexie & {
  workspaces: EntityTable<Workspace, 'id'>,
  agents: EntityTable<Agent, 'id'>,
  threads: EntityTable<Thread, 'id'>
};

const indexedDB = {
  initialize,
  getWorkspaces,
  getAgent,
  getAgents,
  addWorkspaces,
  addAgents,
  getWorkspaceId,
  getAgentId,
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
  updateThread,
};

export default indexedDB;

export { db };