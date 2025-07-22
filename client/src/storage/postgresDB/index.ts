import getAgents from 'src/storage/postgresDB/getAgents';
import getAgent from 'src/storage/postgresDB/getAgent';
import getThread from 'src/storage/postgresDB/getThread';
import createThread from 'src/storage/postgresDB/createThread';
import updateThreadBody from 'src/storage/postgresDB/updateThreadBody';
import updateThreadTitle from 'src/storage/postgresDB/updateThreadTitle';

const postgresDB = {
  getAgents,
  getAgent,
  getThread,
  createThread,
  updateThreadBody,
  updateThreadTitle
};

export default postgresDB;