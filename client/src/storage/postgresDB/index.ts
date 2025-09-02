import { postgresDB as auth } from "src/storage/postgresDB/auth/index";
import getWorkspaces from 'src/storage/postgresDB/getWorkspaces';
import getWorkspaceAgents from 'src/storage/postgresDB/getWorkspaceAgents';
import getAgentId from 'src/storage/postgresDB/getAgentId';
import getAgentByType from 'src/storage/postgresDB//getAgentByType';
import addAgent from 'src/storage/postgresDB/addAgent';
import getAvailableAgents from 'src/storage/postgresDB/getAvailableAgents';
import getAvailableAgentByType from 'src/storage/postgresDB/getAvailableAgentByType';
import getThread from 'src/storage/postgresDB/getThread';
import addThread from 'src/storage/postgresDB/addThread';
import addPublicThread from 'src/storage/postgresDB/addPublicThread';
import duplicateThread from 'src/storage/postgresDB/duplicateThread';
import deleteThread from 'src/storage/postgresDB/deleteThread';
import addQuery from 'src/storage/postgresDB/addQuery';
import deleteQuery from 'src/storage/postgresDB/deleteQuery';
import updateRequestBody from 'src/storage/postgresDB/updateRequestBody';
import updateResponseBody from 'src/storage/postgresDB/updateResponseBody';
import updateThreadTitle from 'src/storage/postgresDB/updateThreadTitle';
import removeThreadTitle from 'src/storage/postgresDB/removeThreadTitle';
import updatedThreadIsBookmarked from 'src/storage/postgresDB/updateIsBookmarked';
import getThreadUpdatedAt from 'src/storage/postgresDB/getThreadUpdatedAt';
import getAgentsUpdatedAt from 'src/storage/postgresDB/getAgentUpdatedAt';
import getWorkspacesUpdatedAt from 'src/storage/postgresDB/getWorkspacesUpdatedAt';
import getWorkspaceId from 'src/storage/postgresDB/getWorkspaceId';
import getAgent from 'src/storage/postgresDB/getAgent';
import getAgentNames from 'src/storage/postgresDB/getAgentNames';

const postgresDB = {
  auth,
  getWorkspaces,
  getWorkspaceId,
  getWorkspaceAgents,
  getAgent,
  getAgentId,
  getAgentByType,
  addAgent,
  getAvailableAgents,
  getAvailableAgentByType,
  getThread,
  addThread,
  addPublicThread,
  duplicateThread,
  deleteThread,
  addQuery,
  deleteQuery,
  updateRequestBody,
  updateResponseBody,
  updateThreadTitle,
  removeThreadTitle,
  updatedThreadIsBookmarked,
  getThreadUpdatedAt,
  getAgentsUpdatedAt,
  getWorkspacesUpdatedAt,
  getAgentNames
};

export default postgresDB;