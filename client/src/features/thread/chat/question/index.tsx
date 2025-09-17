import { memo, useState } from 'react';
import hooks from 'src/hooks';
import PauseRunButton from './PauseRunButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';
import ChangeAgentButton from './ChangeAgentButton';
import { ReqRes } from 'src/types';
import styles from './Question.module.css';

interface Props {
  reqres: ReqRes;
}

const Question = memo(({ reqres }: Props) => {
  const { requestId, requestBody, responseId, responseBody, inferredAgentType, isNew } = reqres;
  const [input, setInput] = useState(requestBody);
  const [isEditing, setIsEditing] = useState(false);
  const { progressBarLength } = hooks.features.useChatContext();
  const { textareaRef } = hooks.features.useHandleQuestion({ input, isEditing });

  return (
    <div className={styles.container}>
      <div className={styles.actionButtons}>
        <EditButton
          requestId={requestId}
          responseId={responseId}
          setIsEditing={setIsEditing}
        />
        <DeleteButton
          requestId={requestId}
          responseId={responseId}
        />
        <MoveButton
          requestId={requestId}
          requestBody={requestBody}
          responseId={responseId}
          responseBody={responseBody}
          inferredAgentType={inferredAgentType}
        />
      </div>
      <div id={`request_${requestId}`} className={styles.questionCard + (isNew ? ` ${styles.isNew}` : '')}>
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
              reqres={reqres}
              isEditing={isEditing}
            />
            <PauseRunButton
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
        {isNew && <div style={{ width: `${progressBarLength * 100}%` }} className={styles.progressBar} />}
      </div>
    </div>
  );
});

export default Question;
