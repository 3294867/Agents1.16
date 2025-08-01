import { useState } from 'react';
import hooks from 'src/hooks';
import { AgentModel } from 'src/types';
import PauseRunButton from './PauseRunButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';
import styles from './Question.module.css';

interface Props {
  userId: string;
  agentId: string;
  agentName: string;
  threadId: string;
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  isNew: boolean;
  agentModel: AgentModel;
  threadBodyLength: number;
}

const Question = ({
  userId,
  agentId,
  agentName,
  threadId,
  requestId,
  requestBody,
  responseId,
  responseBody,
  isNew,
  agentModel,
  threadBodyLength
}: Props) => {
  const [input, setInput] = useState(requestBody);
  const [isEditing, setIsEditing] = useState(false);
  const { textareaRef, progressBarLength } = hooks.useHandleQuestion({ input, isEditing });
  
  return (
    <div className={styles.relativeWrapper}>
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
        {threadBodyLength > 1 && (
          <MoveButton
            userId={userId}
            agentId={agentId}
            agentName={agentName}
            threadId={threadId}
            requestId={requestId}
            requestBody={requestBody}
            responseId={responseId}
            responseBody={responseBody}
          />
        )}
      </div>
      <div id={`question_${requestId}`} className={styles.questionCard + (isNew ? ` ${styles.isNew}` : '')}>
        <div className={styles.inputRow + (isNew ? ` ${styles.isNew}` : '')}>
          <textarea
            id={`textarea_${requestId}`}
            ref={textareaRef}
            disabled={!isEditing}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={() => setTimeout(() => {
              setIsEditing(false);
            }, 100)}
            spellCheck='false'
            className={styles.textarea}
          />
          <div className={styles.pauseRunWrapper}>
            <PauseRunButton
              threadId={threadId}
              requestId={requestId}
              responseId={responseId}
              input={input}
              isNew={isNew}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              agentModel={agentModel}
            />
          </div>
        </div>
        {isNew && <div style={{ width: progressBarLength }} className={styles.progressBar} />}
      </div>
    </div>
  );
};

export default Question;
