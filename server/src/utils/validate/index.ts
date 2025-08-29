import addAgent from './addAgent';
import addPublicThread from './addPublicThread';
import addQuery from './addQuery';
import addThread from './addThread';
import createResponse from './createResponse';
import deleteQuery from './deleteQuery';
import deleteThread from './deleteThread';
import duplicateThread from './duplicateThread';
import getAgentByName from './getAgentByName';

const validate = {
  addAgent,
  addPublicThread,
  addQuery,
  addThread,
  createResponse,
  deleteQuery,
  deleteThread,
  getAgentByName,
  duplicateThread
};

export default validate;