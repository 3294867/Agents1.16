import getAgents from 'src/storage/postgresDB/getAgents';
import getThread from './getThread';
import updateThreadBody from './updateThreadBody';
import updateThreadTitle from './updateThreadTitle';

const postgresDB = {
  getAgents,
  getThread,
  updateThreadBody,
  updateThreadTitle
};

export default postgresDB;