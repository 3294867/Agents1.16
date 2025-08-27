import { useState } from 'react';
import hooks from 'src/hooks';
import PauseRunButton from './PauseRunButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';
import ChangeAgentButton from './ChangeAgentButton';
import { AgentModel, AgentType, Query } from 'src/types';
import styles from './Question.module.css';

interface Props {
  userId: string;
  teamId: string;
  teamName: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  agentModel: AgentModel;
  threadId: string;
  threadBodyLength: number;
  query: Query;
}

const Question = ({
  userId,
  teamId,
  teamName,
  agentId,
  agentName,
  agentType,
  agentModel,
  threadId,
  query,
  threadBodyLength
}: Props) => {
  const { requestId, requestBody, responseId, responseBody, isNew, inferredAgentType } = query;
  const [input, setInput] = useState(requestBody);
  const [isEditing, setIsEditing] = useState(false);
  const { textareaRef, progressBarLength } = hooks.features.useHandleQuestion({ input, isEditing });
  
  return (
    <div className={styles.container}>
      <div className={styles.actionButtons}>
        <EditButton requestId={requestId} setIsEditing={setIsEditing} />
        <DeleteButton
          threadId={threadId}
          requestId={requestId}
          responseId={responseId}
          threadBodyLength={threadBodyLength}
          agentId={agentId}
          agentName={agentName}
        />
        <MoveButton
          userId={userId}
          teamId={teamId}
          teamName={teamName}
          agentId={agentId}
          agentName={agentName}
          threadId={threadId}
          threadBodyLength={threadBodyLength}
          requestId={requestId}
          requestBody={requestBody}
          responseId={responseId}
          responseBody={responseBody}
          inferredAgentType={inferredAgentType}
        />
      </div>
      <div id={`question_${requestId}`} className={styles.questionCard + (isNew ? ` ${styles.isNew}` : '')}>
        <div className={styles.inputRow + (isNew ? ` ${styles.isNew}` : '')}>
          <textarea
            id={`textarea_${requestId}`}
            ref={textareaRef}
            disabled={!isEditing}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={() => setTimeout(() => setIsEditing(false), 100)}
            spellCheck='false'
            className={styles.textarea}
          />
          <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', display: 'flex' }}>
            <ChangeAgentButton
              userId={userId}
              teamId={teamId}
              teamName={teamName}
              currentAgentId={agentId}
              currentAgentType={agentType}
              currentAgentName={agentName}
              inferredAgentType={inferredAgentType}
              threadId={threadId}
              requestId={requestId}
              requestBody={requestBody}
              responseId={responseId}
              responseBody={responseBody}
              isEditing={isEditing}
              isNew={isNew}
            />
            <PauseRunButton
              threadId={threadId}
              agentId={agentId}
              agentName={agentName}
              agentModel={agentModel}
              requestId={requestId}
              responseId={responseId}
              input={input}
              isNew={isNew}
              inferredAgentType={inferredAgentType}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
        {isNew && <div style={{ width: progressBarLength }} className={styles.progressBar} />}
      </div>
    </div>
  );
};

export default Question;
