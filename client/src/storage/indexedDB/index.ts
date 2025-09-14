import initialize from 'src/storage/indexedDB/initialize';
import addWorkspaces from 'src/storage/indexedDB/addWorkspaces';
import addAgents from 'src/storage/indexedDB/storeAgents';
import getAgents from 'src/storage/indexedDB/getAgents';
import getWorkspaceId from 'src/storage/indexedDB/getWorkspaceId';
import getAgentByType from 'src/storage/indexedDB/getAgentByType';
import addAgent from 'src/storage/indexedDB/addAgent';
import getThread from 'src/storage/indexedDB/getThread';
import addNewThread from 'src/storage/indexedDB/addNewThread';
import deleteThread from 'src/storage/indexedDB/deleteThread';
import updateThreadName from 'src/storage/indexedDB/updateThreadName';
import addReqRes from 'src/storage/indexedDB/addReqRes';
import updateReqRes from 'src/storage/indexedDB/updateReqRes';
import deleteReqRes from 'src/storage/indexedDB/deleteReqRes';
import updateReqResIsNew from 'src/storage/indexedDB/updateReqResIsNew';
import updateThreadPositionY from 'src/storage/indexedDB/updateThreadPositionY';
import updateThreadIsBookmarked from 'src/storage/indexedDB/updateThreadIsBookmarked';
import pauseResponse from 'src/storage/indexedDB/pauseResponse';
import getFirstReqRes from 'src/storage/indexedDB/getFirstReqRes';
import addThread from 'src/storage/indexedDB/addThread';
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
  addNewThread,
  deleteThread,
  updateThreadName,
  removeThreadName,
  addReqRes,
  updateReqRes,
  deleteReqRes,
  updateReqResIsNew,
  updateThreadPositionY,
  updateThreadIsBookmarked,
  pauseResponse,
  getFirstReqRes,
  addThread,
};

export default indexedDB;