import Answer from './Answer';
import Question from './question';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  threadBody: Query[] | [];
};

const Chat = (props: Props) => {
  return (
    <div id='chat' className='flex flex-1 flex-col mt-8 pb-48 gap-8 overflow-x-hidden overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1'>
      {props.threadBody.length > 0 && props.threadBody.map((i, idx) => (
        <div key={idx} className='space-y-8'>
          <Question
            requestId={i.requestId}
            requestBody={i.requestBody}
            isNew={i.isNew}
          />
          <Answer
            threadId={props.threadId}
            responseId={i.responseId}
            responseBody={i.responseBody}
            isNew={i.isNew}
          />
        </div>
      ))}
    </div>
  );
};

export default Chat;
