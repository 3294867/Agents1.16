import { postgresDB as auth } from "src/storage/postgresDB/auth/index";
import getTeams from 'src/storage/postgresDB/getTeams';
import getTeamByName from 'src/storage/postgresDB/getTeamByName';
import getAgents from 'src/storage/postgresDB/getAgents';
import getAgentByName from 'src/storage/postgresDB/getAgentByName';
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
import getTeamsUpdatedAt from 'src/storage/postgresDB/getTeamsUpdatedAt';

const postgresDB = {
  auth,
  getTeams,
  getTeamByName,
  getAgents,
  getAgentByName,
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
  getTeamsUpdatedAt
};

export default postgresDB;