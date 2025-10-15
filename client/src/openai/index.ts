import createResponse from 'src/openai/createResponse';
import createThreadName from 'src/openai/createThreadName';
import inferAgentType from 'src/openai/inferAgentType';

export const openai = {
  createResponse,
  createThreadName,
  inferAgentType
};

export default openai;