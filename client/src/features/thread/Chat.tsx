import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import newResponseStorage from 'src/storage/sessionStorage/newResponseStorage';
import { Paragraph } from 'src/components/Paragraph';
import { ThreadBody } from 'src/types';

interface ChatProps {
  threadBody: ThreadBody
};

const Chat = (props: ChatProps) => {
  const newResponse = newResponseStorage.get();
  
  return (
    <div className='flex flex-1 flex-col mt-8 pb-48 gap-8 overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1'>
      {props.threadBody.length > 0 && props.threadBody.map((i, idx) => (
        <div key={idx} className='space-y-2'>
          <Question requestId={i.requestId} requestBody={i.requestBody} />
          <Answer
            responseId={i.responseId}
            responseBody={i.responseBody}
            newResponseId={newResponse.responseId}
          />
        </div>
      ))}
    </div>
  );
};

export default Chat;

interface QuestionProps {
  requestId: string;
  requestBody: string;
};

const Question = (props: QuestionProps) => {
  return (
    <div id={props.requestId} className='w-full flex justify-end'>
      <div className='flex px-4 py-2 rounded-xl bg-white/15 text-text-primary'>
        <Paragraph variant='thick'>
          {props.requestBody}
        </Paragraph>
      </div>
    </div>
  );
};

interface AnswerProps {
  responseId: string;
  responseBody: string;
  newResponseId: string;
}

const Answer = (props: AnswerProps) => {
  return props.responseId === props.newResponseId
    ? <ProgressiveParagraph responseBody={props.responseBody} />
    : <Paragraph variant='thin'>{props.responseBody}</Paragraph>
};

interface ProgressiveTextProps {
  responseBody: string;
};

const ProgressiveParagraph = (props: ProgressiveTextProps) => {
  const [copy, setCopy] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < props.responseBody.length) {
        setCopy(props.responseBody.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    },12);

    return () => clearInterval(timer);
  },[props.responseBody]);

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