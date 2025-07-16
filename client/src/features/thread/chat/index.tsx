import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Paragraph } from 'src/components/Paragraph';
import hooks from 'src/hooks';
import { ThreadBody } from 'src/types';
import NewQuery from './NewQuery';

interface ChatProps {
  threadId: string;
  threadBody: ThreadBody;
};

const Chat = (props: ChatProps) => {
  return (
    <div className='flex flex-1 flex-col mt-8 pb-48 gap-8 overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1'>
      {props.threadBody.length > 0 && props.threadBody.map((i, idx) => (
        <div key={idx} className='space-y-2'>
          <Question requestId={i.requestId} requestBody={i.requestBody} />
          <Answer responseId={i.responseId} responseBody={i.responseBody} />
        </div>
      ))}
      <NewQuery threadId={props.threadId} />
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
}

const Answer = (props: AnswerProps) => {
  return <Paragraph variant='thin'>{props.responseBody}</Paragraph>;
};
