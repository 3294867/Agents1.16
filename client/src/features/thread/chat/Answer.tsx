import { memo } from 'react';
import AnimatedParagraph from 'src/components/AnimatedParagraph';
import Paragraph from 'src/components/paragraph';
import hooks from 'src/hooks';
import { AgentType } from 'src/types';

interface AnswerProps {
  requestId: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
  isNew: boolean;
}

const Answer = memo(({ requestId, responseId, responseBody, inferredAgentType, isNew }: AnswerProps) => {
  const { threadId } = hooks.features.useThreadContext();
  const { progressBarLength, setProgressBarLength } = hooks.features.useChatContext();
  const copy = hooks.features.useHandleAnimatedParagraph({
    threadId,
    requestId,
    responseId,
    responseBody,
    inferredAgentType,
    progressBarLength,
    setProgressBarLength
  });
  
  return isNew
    ? <AnimatedParagraph copy={copy} />
    : <Paragraph style={{ lineHeight: '2' }}>{responseBody}</Paragraph>;
});

export default Answer;
