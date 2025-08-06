import { motion } from 'framer-motion';
import Paragraph from 'src/components/Paragraph';
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
  return isNew
    ? (
      <AnimatedParagraph
        threadId={threadId}
        requestId={requestId}
        responseId={responseId}
        responseBody={responseBody}
        inferredAgentType={inferredAgentType}
      />
    )
    : <Paragraph style={{ lineHeight: '2' }}>{responseBody}</Paragraph>;
};

export default Answer;

interface AnimatedParagraphProps {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

const AnimatedParagraph = ({ threadId, requestId, responseId, responseBody, inferredAgentType }: AnimatedParagraphProps) => {
  const copy = hooks.useHandleAnimatedParagraph({
    threadId,
    requestId,
    responseId,
    responseBody,
    inferredAgentType
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paragraph variant='thin' style={{ lineHeight: '2' }}>
        {copy}
      </Paragraph>
    </motion.div>
  );
};