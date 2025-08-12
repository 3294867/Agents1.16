import getAgents from 'src/storage/postgresDB/getAgents';
import getAgentByName from 'src/storage/postgresDB/getAgentByName';
import addAgent from 'src/storage/postgresDB/addAgent';
import getAvailableAgents from 'src/storage/postgresDB/getAvailableAgents';
import getAvailableAgent from 'src/storage/postgresDB//getAvailableAgent';
import getThread from 'src/storage/postgresDB/getThread';
import addThread from 'src/storage/postgresDB/addThread';
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
import login from 'src/storage/postgresDB/auth/login';
import signUp from 'src/storage/postgresDB/auth/signUp';
import getCurrentUser from 'src/storage/postgresDB/auth/getCurrentUser';
import logout from 'src/storage/postgresDB/auth/logout';

const postgresDB = {
  getAgents,
  getAgentByName,
  addAgent,
  getAvailableAgents,
  getAvailableAgent,
  getThread,
  addThread,
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
  auth: {
    login,
    signUp,
    getCurrentUser,
    logout
  }
};

export default postgresDB;