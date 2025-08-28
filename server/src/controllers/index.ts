import addAgent from './addAgent';
import addPublicThread from './addPublicThread';
import addQuery from './addQuery';
import addThread from './addThread';
import createResponse from './createResponse';
import createThreadTitle from './createThreadTitle';
import deleteQuery from './deleteQuery';
import deleteThread from './deleteThread';
import duplicateThread from './duplicateThread';
import getAgentByName from './getAgentByName';
import getAgentByType from './getAgentByType';
import getAgents from './getAgents';
import getAgentsUpdatedAt from './getAgentsUpdatedAt';
import getAvailableAgentByType from './getAvailableAgentByType';
import getAvailableAgents from './getAvailableAgents';
import getCurrentUser from './getCurrentUser';
import getTeamByName from './getTeamByName';
import getTeams from './getTeams';
import getTeamsUpdatedAt from './getTeamsUpdatedAt';
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
import updateThreadTitle from './updateThreadTitle';

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
  getAgentByName,
  getAgentByType,
  getAgents,
  getAgentsUpdatedAt,
  getAvailableAgentByType,
  getAvailableAgents,
  getCurrentUser,
  getTeamByName,
  getTeams,
  getTeamsUpdatedAt,
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
  updateThreadTitle
};

export default controllers;