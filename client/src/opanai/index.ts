import createResponse from 'src/opanai/createResponse';
import createThreadTitle from 'src/opanai/createThreadTitle';
import inferAgentType from 'src/opanai/inferAgentType';

export const openai = {
  createResponse,
  createThreadTitle,
  inferAgentType
};

export default openai;