import Answer from './Answer';
import Question from './question';
import { AgentModel, Query } from 'src/types';

interface Props {
  threadId: string;
  threadBody: Query[] | [];
  agentModel: AgentModel;
};

const Chat = ({ threadId, threadBody, agentModel }: Props) => {
  return (
    <div id='chat' className='flex flex-1 flex-col mt-8 pb-48 gap-8 overflow-x-hidden overflow-y-auto scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1'>
      {threadBody.length > 0 && threadBody.map((i, idx) => (
        <div key={idx} className='space-y-8'>
          <Question
            threadId={threadId}
            requestId={i.requestId}
            requestBody={i.requestBody}
            responseId={i.responseId}
            isNew={i.isNew}
            agentModel={agentModel}
          />
          <Answer
            threadId={threadId}
            requestId={i.requestId}
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
