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
import getAgents from './getAgents';
import getAgentsUpdatedAt from './getAgentsUpdatedAt';
import getAvailableAgentByType from './getAvailableAgentByType';
import getAvailableAgents from './getAvailableAgents';
import getCurrentUser from './getCurrentUser';
import getWorkspaceId from './getWorkspaceId';
import getWorkspacesUpdatedAt from './getWorkspacesUpdatedAt';
import getThread from './getThread';
import getThreadUpdatedAt from './getThreadUpdatedAt';
import inferAgentType from './inferAgentType';
import login from './login';
import logout from './logout';
import removeThreadTitle from './removeThreadTitle';
import signUp from './signUp';
import updateRequestBody from './updateRequestBody';
import updateResponseBody from './updateResponseBody';
import updateThreadIsBookmarked from './updateThreadIsBookmarked';
import updateThreadName from './updateThreadName';
import getWorkspaces from './getWorkspaces';

const controllers = {
  addAgent,
  addPublicThread,
  addQuery,
  addThread,
  createResponse,
  createThreadTitle,
  deleteQuery,
  deleteThread,
  duplicateThread,
  getAgentIdByName,
  getAgents,
  getAgentsUpdatedAt,
  getAvailableAgentByType,
  getAvailableAgents,
  getCurrentUser,
  getWorkspaceId,
  getWorkspaces,
  getWorkspacesUpdatedAt,
  getThread,
  getThreadUpdatedAt,
  inferAgentType,
  login,
  logout,
  removeThreadTitle,
  signUp,
  updateRequestBody,
  updateResponseBody,
  updateThreadIsBookmarked,
  updateThreadName
};

export default controllers;