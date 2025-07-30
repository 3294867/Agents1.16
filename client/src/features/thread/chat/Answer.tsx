import { motion } from 'framer-motion';
import { Paragraph } from 'src/components/Paragraph';
import hooks from 'src/hooks';

interface AnswerProps {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
}

const Answer = ({ threadId, requestId, responseId, responseBody, isNew }: AnswerProps) => {
  return isNew
    ? (
      <AnimatedParagraph
        threadId={threadId}
        requestId={requestId}
        responseId={responseId}
        responseBody={responseBody}
      />
    )
    : <Paragraph variant='thin' className='leading-loose'>{responseBody}</Paragraph>;
};

export default Answer;

interface ProgressiveParagraphProps {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
}

const AnimatedParagraph = ({ threadId, requestId, responseId, responseBody }: ProgressiveParagraphProps) => {
  const copy = hooks.useHandleAnimatedParagraph({
    threadId: threadId,
    requestId: requestId,
    responseId: responseId,
    responseBody: responseBody
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paragraph variant='thin' className='leading-loose'>
        {copy}
      </Paragraph>
    </motion.div>
  );
};