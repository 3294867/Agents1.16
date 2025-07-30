import Answer from './Answer';
import { AgentModel, Query } from 'src/types';
import Question from './question';
import styles from './Chat.module.css';

interface Props {
  userId: string;
  agentId: string;
  agentName: string;
  threadId: string;
  threadBody: Query[] | [];
  agentModel: AgentModel;
}

const Chat = ({ userId, agentId, agentName, threadId, threadBody, agentModel }: Props) => {
  return (
    <div id='chat' className={styles.chat}>
      {threadBody.length > 0 && threadBody.map((i, idx) => (
        <div key={idx} className={styles.messageGroup}>
          <Question
            userId={userId}
            agentId={agentId}
            agentName={agentName}
            threadId={threadId}
            requestId={i.requestId}
            requestBody={i.requestBody}
            responseId={i.responseId}
            responseBody={i.responseBody}
            isNew={i.isNew}
            agentModel={agentModel}
            threadBodyLength={threadBody.length}
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
