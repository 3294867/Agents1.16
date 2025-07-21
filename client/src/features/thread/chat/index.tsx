import { Paragraph } from 'src/components/Paragraph';
import Answer from './Answer';
import { Query } from 'src/types';

interface ChatProps {
  threadId: string;
  threadBody: Query[] | [];
};

const Chat = (props: ChatProps) => {
  return (
    <div id='chat' className='flex flex-1 flex-col mt-8 pb-48 gap-8 overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1'>
      {props.threadBody.length > 0 && props.threadBody.map((i, idx) => (
        <div key={idx} className='space-y-2'>
          <Question requestId={i.requestId} requestBody={i.requestBody} />
          <Answer threadId={props.threadId} responseId={i.responseId} responseBody={i.responseBody} isNew={i.isNew} />
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
    <div id={`question_${props.requestId}`} className='w-full flex justify-end'>
      <div className='flex px-4 py-2 rounded-xl bg-white/15 text-text-primary'>
        <Paragraph variant='thick'>
          {props.requestBody}
        </Paragraph>
      </div>
    </div>
  );
};
