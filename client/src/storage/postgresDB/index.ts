import getAgents from 'src/storage/postgresDB/getAgents';
import getAgent from 'src/storage/postgresDB/getAgent';
import getThread from 'src/storage/postgresDB/getThread';
import createThread from 'src/storage/postgresDB/createThread';
import addQuery from 'src/storage/postgresDB/addQuery';
import updateRequestBody from './updateRequestBody';
import updateResponseBody from './updateResponseBody';
import updateThreadTitle from 'src/storage/postgresDB/updateThreadTitle';

const postgresDB = {
  getAgents,
  getAgent,
  getThread,
  createThread,
  addQuery,
  updateRequestBody,
  updateResponseBody,
  updateThreadTitle
};

export default postgresDB;