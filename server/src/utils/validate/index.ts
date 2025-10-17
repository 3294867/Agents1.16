import inferAgentType from './inferAgentType';
import addAgent from './addAgent';
import addPublicThread from './addPublicThread';
import addReqRes from './addReqRes';
import addThread from './addThread';
import createResponse from './createResponse';
import createThreadName from './createThreadName';
import deleteReqRes from './deleteReqRes';
import deleteThread from './deleteThread';
import duplicateThread from './duplicateThread';
import getAgentId from './getAgentId';
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
import getAgent from './getAgent';
import getAgentNames from './getAgentNames';
import getAvailableAgents from './getAvailableAgents';
import getAgentByType from './getAgentByType';
import getWorkspaceMembers from './getWorkspaceMembers';
import updateMemberRole from './updateMemberRole';
import getUsers from './getUsers';
import inviteUser from './inviteUser';
import getNotifications from './getNotifications';
import acceptWorkspaceInvite from './acceptWorkspaceInvite';
import declineWorkspaceInvite from './declineWorkspaceInvite';
import dismissWorkspaceInvite from './dismissWorkspaceInvite';

const validate = {
  addAgent,
  addPublicThread,
  addReqRes,
  addThread,
  createResponse,
  deleteReqRes,
  deleteThread,
  getAgentId,
  duplicateThread,
  createThreadName,
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
  getAgentByType,
  getAgentNames,
  getAvailableAgents,
  getWorkspaceMembers,
  updateMemberRole,
  getUsers,
  inviteUser,
  getNotifications,
  acceptWorkspaceInvite,
  declineWorkspaceInvite,
  dismissWorkspaceInvite
};

export default validate;