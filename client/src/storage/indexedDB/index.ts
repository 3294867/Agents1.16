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
import updateThreadName from 'src/storage/indexedDB/updateThreadName';
import addReqRes from 'src/storage/indexedDB/addReqRes';
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
import removeThreadName from 'src/storage/indexedDB/removeThreadName';

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
  updateThreadName,
  removeThreadName,
  addReqRes,
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