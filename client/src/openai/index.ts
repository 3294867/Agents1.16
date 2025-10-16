import createResponse from 'src/openai/createResponse';
import createStructuredResponse from './createStructuredResponse';
import createThreadName from 'src/openai/createThreadName';
import inferAgentType from 'src/openai/inferAgentType';

export const openai = {
  createResponse,
  createStructuredResponse,
  createThreadName,
  inferAgentType
};

export default openai;