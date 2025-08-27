import AnimatedParagraph from 'src/components/AnimatedParagraph';
import Paragraph from 'src/components/paragraph';
import hooks from 'src/hooks';
import { AgentType } from 'src/types';

interface AnswerProps {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
  inferredAgentType: AgentType;
}

const Answer = ({ threadId, requestId, responseId, responseBody, isNew, inferredAgentType }: AnswerProps) => {
    const copy = hooks.features.useHandleAnimatedParagraph({
    threadId,
    requestId,
    responseId,
    responseBody,
    inferredAgentType
  });
  
  return isNew
    ? <AnimatedParagraph copy={copy} />
    : <Paragraph style={{ lineHeight: '2' }}>{responseBody}</Paragraph>;
};

export default Answer;
