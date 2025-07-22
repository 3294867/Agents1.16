import { motion } from 'framer-motion';
import { Paragraph } from 'src/components/Paragraph';
import hooks from 'src/hooks';

interface AnswerProps {
  threadId: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
};

const Answer = (props: AnswerProps) => {
  return props.isNew
    ? (
      <ProgressiveParagraph
        threadId={props.threadId}
        isNew={props.isNew}
        responseId={props.responseId}
        responseBody={props.responseBody}
      />
    )
    : <Paragraph variant='thin' className='leading-loose'>{props.responseBody}</Paragraph>;
};

export default Answer;

interface ProgressiveTextProps {
  threadId: string;
  isNew: boolean;
  responseId: string;
  responseBody: string;
};

const ProgressiveParagraph = (props: ProgressiveTextProps) => {
  const copy = hooks.useHandleProgressiveParagraph({
    threadId: props.threadId,
    responseId: props.responseId,
    responseBody: props.responseBody
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
  )
};