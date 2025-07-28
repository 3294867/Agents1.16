import getAgents from 'src/storage/postgresDB/getAgents';
import getAgent from 'src/storage/postgresDB/getAgent';
import getThread from 'src/storage/postgresDB/getThread';
import createThread from 'src/storage/postgresDB/createThread';
import addQuery from 'src/storage/postgresDB/addQuery';
import deleteQuery from 'src/storage/postgresDB/deleteQuery';
import updateRequestBody from 'src/storage/postgresDB/updateRequestBody';
import updateResponseBody from 'src/storage/postgresDB/updateResponseBody';
import updateThreadTitle from 'src/storage/postgresDB/updateThreadTitle';
import removeThreadTitle from 'src/storage/postgresDB/removeThreadTitle';
import updatedThreadIsBookmarked from './updateIsBookmarked';

const postgresDB = {
  getAgents,
  getAgent,
  getThread,
  createThread,
  addQuery,
  deleteQuery,
  updateRequestBody,
  updateResponseBody,
  updateThreadTitle,
  removeThreadTitle,
  updatedThreadIsBookmarked
};

export default postgresDB;