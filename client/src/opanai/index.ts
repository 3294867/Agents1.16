import createResponse from 'src/opanai/createResponse';
import createThreadName from 'src/opanai/createThreadName';
import inferAgentType from 'src/opanai/inferAgentType';

export const openai = {
  createResponse,
  createThreadName,
  inferAgentType
};

export default openai;