import { postgresDB as auth } from "src/storage/postgresDB/auth/index";
import getAgents from 'src/storage/postgresDB/getAgents';
import getAgentByName from 'src/storage/postgresDB/getAgentByName';
import addAgent from 'src/storage/postgresDB/addAgent';
import getAvailableAgents from 'src/storage/postgresDB/getAvailableAgents';
import getAvailableAgent from 'src/storage/postgresDB//getAvailableAgent';
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
import getAgentsUpdatedAt from 'src/storage/postgresDB/getAgentsUpdatedAt';

const postgresDB = {
  auth,
  getAgents,
  getAgentByName,
  addAgent,
  getAvailableAgents,
  getAvailableAgent,
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
  getAgentsUpdatedAt
};

export default postgresDB;