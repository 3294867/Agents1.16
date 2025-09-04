import { memo, useState } from 'react';
import hooks from 'src/hooks';
import PauseRunButton from './PauseRunButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';
import ChangeAgentButton from './ChangeAgentButton';
import { AgentModel, AgentType, ReqRes } from 'src/types';
import styles from './Question.module.css';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  agentModel: AgentModel;
  threadId: string;
  threadBodyLength: number;
  reqres: ReqRes;
}

const Question = memo(({
  workspaceId,
  workspaceName,
  agentId,
  agentName,
  agentType,
  agentModel,
  threadId,
  threadBodyLength,
  reqres
}: Props) => {
  const { requestId, requestBody, responseId, responseBody, inferredAgentType, isNew } = reqres;
  const [input, setInput] = useState(requestBody);
  const [isEditing, setIsEditing] = useState(false);
  const { textareaRef, progressBarLength } = hooks.features.useHandleQuestion({ input, isEditing });
  
  return (
    <div className={styles.container}>
      <div className={styles.actionButtons}>
        <EditButton
          requestId={requestId}
          responseId={responseId}
          setIsEditing={setIsEditing}
        />
        <DeleteButton
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          threadId={threadId}
          requestId={requestId}
          responseId={responseId}
          threadBodyLength={threadBodyLength}
          agentId={agentId}
          agentName={agentName}
        />
        <MoveButton
          workspaceId={workspaceId}
          workspaceName={workspaceName}
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
              workspaceId={workspaceId}
              workspaceName={workspaceName}
              currentAgentId={agentId}
              currentAgentName={agentName}
              currentAgentType={agentType}
              threadId={threadId}
              reqres={reqres}
              isEditing={isEditing}
            />
            <PauseRunButton
              workspaceId={workspaceId}
              workspaceName={workspaceName}
              agentId={agentId}
              agentName={agentName}
              agentModel={agentModel}
              threadId={threadId}
              requestId={requestId}
              responseId={responseId}
              inferredAgentType={inferredAgentType}
              isNew={isNew}
              input={input}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
        {isNew && <div style={{ width: progressBarLength }} className={styles.progressBar} />}
      </div>
    </div>
  );
});

export default Question;
