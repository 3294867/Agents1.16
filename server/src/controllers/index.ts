import addAgent from './addAgent';
import addPublicThread from './addPublicThread';
import addReqRes from './addReqRes';
import addThread from './addThread';
import createResponse from './createResponse';
import createThreadName from './createThreadName';
import deleteQuery from './deleteQuery';
import deleteThread from './deleteThread';
import duplicateThread from './duplicateThread';
import getAgentId from './getAgentId';
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
import removeThreadName from './removeThreadName';
import signUp from './signUp';
import updateRequestBody from './updateRequestBody';
import updateResponseBody from './updateResponseBody';
import updateThreadIsBookmarked from './updateThreadIsBookmarked';
import updateThreadName from './updateThreadName';
import getWorkspaces from './getWorkspaces';
import getAgentUpdatedAt from './getAgentUpdatedAt';
import getAgent from './getAgent';
import getAgentNames from './getAgentNames';

const controllers = {
  addAgent,
  addPublicThread,
  addReqRes,
  addThread,
  createResponse,
  createThreadName,
  deleteQuery,
  deleteThread,
  duplicateThread,
  getAgentId,
  getAgentUpdatedAt,
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
  removeThreadName,
  signUp,
  updateRequestBody,
  updateResponseBody,
  updateThreadIsBookmarked,
  updateThreadName,
  getAgent,
  getAgentNames
};

export default controllers;