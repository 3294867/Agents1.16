import auth from "src/storage/postgresDB/auth/index";
import getWorkspaces from 'src/storage/postgresDB/getWorkspaces';
import getAgentId from 'src/storage/postgresDB/getAgentId';
import addAgent from 'src/storage/postgresDB/addAgent';
import getAvailableAgents from 'src/storage/postgresDB/getAvailableAgents';
import getAvailableAgentByType from 'src/storage/postgresDB/getAvailableAgentByType';
import getThread from 'src/storage/postgresDB/getThread';
import addThread from 'src/storage/postgresDB/addThread';
import addPublicThread from 'src/storage/postgresDB/addPublicThread';
import duplicateThread from 'src/storage/postgresDB/duplicateThread';
import deleteThread from 'src/storage/postgresDB/deleteThread';
import addReqRes from 'src/storage/postgresDB/addReqRes';
import deleteReqRes from 'src/storage/postgresDB/deleteReqRes';
import updateRequestBody from 'src/storage/postgresDB/updateRequestBody';
import updateResponseBody from 'src/storage/postgresDB/updateResponseBody';
import updateThreadName from 'src/storage/postgresDB/updateThreadName';
import removeThreadName from 'src/storage/postgresDB/removeThreadName';
import getThreadUpdatedAt from 'src/storage/postgresDB/getThreadUpdatedAt';
import getAgentUpdatedAt from 'src/storage/postgresDB/getAgentUpdatedAt';
import getWorkspacesUpdatedAt from 'src/storage/postgresDB/getWorkspacesUpdatedAt';
import getWorkspaceId from 'src/storage/postgresDB/getWorkspaceId';
import getAgent from 'src/storage/postgresDB/getAgent';
import getAgentNames from 'src/storage/postgresDB/getAgentNames';
import updateThreadIsBookmarked from 'src/storage/postgresDB/updateIsBookmarked';
import getAgentByType from './getAgentByType';
import getWorkspaceMembers from './getWorkspaceMembers';
import updateMemberRole from './updateMemberRole';
import getUsers from './getUsers';
import inviteUser from './inviteUser';
import getNotifications from './getNotifications';
import acceptWorkspaceInvite from './acceptWorkspaceInvite';
import declineWorkspaceInvite from './declineWorkspaceInvite';
import dismissWorkspaceInvite from './dismissWorkspaceInvite';

const postgresDB = {
  auth,
  getWorkspaces,
  getWorkspaceId,
  getWorkspacesUpdatedAt,
  getAgent,
  getAgentId,
  getAgentUpdatedAt,
  getAgentNames,
  getAgentByType,
  addAgent,
  getAvailableAgents,
  getAvailableAgentByType,
  getThread,
  addThread,
  addPublicThread,
  duplicateThread,
  deleteThread,
  addReqRes,
  deleteReqRes,
  updateRequestBody,
  updateResponseBody,
  updateThreadName,
  removeThreadName,
  updateThreadIsBookmarked,
  getThreadUpdatedAt,
  getWorkspaceMembers,
  updateMemberRole,
  getUsers,
  inviteUser,
  getNotifications,
  acceptWorkspaceInvite,
  declineWorkspaceInvite,
  dismissWorkspaceInvite,
};

export default postgresDB;
