import Answer from './Answer';
import Question from './question';
import { AgentModel, AgentType, Query } from 'src/types';
import styles from './Chat.module.css';

interface Props {
  userId: string;
  teamId: string;
  teamName: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  agentModel: AgentModel;
  threadId: string;
  threadBody: Query[] | [];
}

const Chat = ({
  userId,
  teamId,
  teamName,
  agentId,
  agentName,
  agentType,
  agentModel,
  threadId,
  threadBody
}: Props) => {
  return (
    <div id='chat' className={styles.chat}>
      {threadBody.length > 0 && threadBody.map((i, idx) => (
        <div key={idx} className={styles.messageGroup}>
          <Question
            userId={userId}
            teamId={teamId}
            teamName={teamName}
            agentId={agentId}
            agentName={agentName}
            agentType={agentType}
            threadId={threadId}
            agentModel={agentModel}
            threadBodyLength={threadBody.length}
            query={i}
          />
          <Answer
            threadId={threadId}
            requestId={i.requestId}
            responseId={i.responseId}
            responseBody={i.responseBody}
            isNew={i.isNew}
            inferredAgentType={i.inferredAgentType}
          />
        </div>
      ))}
    </div>
  );
};

export default Chat;
