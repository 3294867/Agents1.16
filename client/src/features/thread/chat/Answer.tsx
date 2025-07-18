import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Paragraph } from 'src/components/Paragraph';
import { indexedDB } from 'src/storage/indexedDB';

interface AnswerProps {
  threadId: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
};

const Answer = (props: AnswerProps) => {
  return props.isNew
    ? <ProgressiveParagraph threadId={props.threadId} isNew={props.isNew} responseId={props.responseId} responseBody={props.responseBody} />
    : <Paragraph variant='thin'>{props.responseBody}</Paragraph>;
};

export default Answer;

interface ProgressiveTextProps {
  threadId: string;
  isNew: boolean;
  responseId: string;
  responseBody: string;
};

const ProgressiveParagraph = (props: ProgressiveTextProps) => {
  const [copy, setCopy] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const animate = async () => {
      let i = 0;
      timer = setInterval(() => {
        if (i < props.responseBody.length) {
          setCopy(props.responseBody.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      },12);
    };
    
    animate().then(() => {
      indexedDB.updateQueryIsNewFlag({
        threadId: props.threadId,
        responseId: props.responseId,
        isNew: false
      });
    });
    
        
    return () => clearInterval(timer);
  },[props.responseBody, props.threadId, props.responseId, props.isNew]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paragraph variant='thin'>
        {copy}
      </Paragraph>
    </motion.div>
  )
};