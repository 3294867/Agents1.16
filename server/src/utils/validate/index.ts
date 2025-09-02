import inferAgentType from './inferAgentType';
import addAgent from './addAgent';
import addPublicThread from './addPublicThread';
import addQuery from './addQuery';
import addThread from './addThread';
import createResponse from './createResponse';
import createThreadTitle from './createThreadTitle';
import deleteQuery from './deleteQuery';
import deleteThread from './deleteThread';
import duplicateThread from './duplicateThread';
import getAgentIdByName from './getAgentIdByName';
import getAgentUpdatedAt from './getAgentUpdatedAt';
import getAvailableAgentByType from './getAvailableAgentByType';
import getThread from './getThread';
import getThreadUpdatedAt from './getThreadUpdatedAt';
import getWorkspaceId from './getWorkspaceId';
import getWorkspaces from './getWorkspaces';
import getWorkspacesUpdatedAt from './getWorkspacesUpdatedAt';
import login from './login';
import removeThreadTitle from './removeThreadTitle';
import signup from './signup';
import updateRequestBody from './updateRequestBody';
import updateResponseBody from './updateResponseBody';
import updateThreadIsBookmarked from './updateThreadIsBookmarked';
import updateThreadName from './updateThreadName';
import getWorkspaceAgents from './getWorkspaceAgents';
import getAgent from './getWorkspaceAgent';
import getAgentNames from './getAgentNames';
import getAvailableAgents from './getAvailableAgents';

const validate = {
  addAgent,
  addPublicThread,
  addQuery,
  addThread,
  createResponse,
  deleteQuery,
  deleteThread,
  getAgentIdByName,
  duplicateThread,
  createThreadTitle,
  getWorkspaceAgents,
  getAgentUpdatedAt,
  getAvailableAgentByType,
  getWorkspaceId,
  getWorkspaces,
  inferAgentType,
  getWorkspacesUpdatedAt,
  getThread,
  getThreadUpdatedAt,
  login,
  removeThreadTitle,
  signup,
  updateRequestBody,
  updateResponseBody,
  updateThreadIsBookmarked,
  updateThreadName,
  getAgent,
  getAgentNames,
  getAvailableAgents
};

export default validate;