import { memo } from 'react';
import Answer from './Answer';
import Question from './question';
import { AgentModel, AgentType, ReqRes } from 'src/types';
import styles from './Chat.module.css';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  agentModel: AgentModel;
  threadId: string;
  threadBody: ReqRes[] | [];
}

const Chat = memo(({
  workspaceId,
  workspaceName,
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
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            agentId={agentId}
            agentName={agentName}
            agentType={agentType}
            agentModel={agentModel}
            threadId={threadId}
            threadBodyLength={threadBody.length}
            reqres={i}
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
});

export default Chat;
