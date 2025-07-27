import { useState } from 'react';
import hooks from 'src/hooks';
import { AgentModel } from 'src/types';
import PauseRunButton from './PauseRunButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';

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
};

const Question = ({ userId, agentId, agentName, threadId, requestId, requestBody, responseId, responseBody, isNew, agentModel }: Props) => {
  const [input, setInput] = useState(requestBody);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { textareaRef, progressBarLength } = hooks.useHandleQuestion({ input, isEditing });
  
  return (
    <div className='relative w-full pt-12'>
      <div
        id={`question_${requestId}`}
        className='w-full group flex flex-col border border-border rounded-xl shadow-sm shadow-black bg-background-card overflow-hidden'
        style={{ paddingTop: 16, paddingBottom: isNew ? 0 : 16, paddingRight: isNew ? 0 : 16, paddingLeft: isNew ? 0 : 16 }}
      >
        <div className='absolute top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5'>
          <EditButton
            requestId={requestId}
            setIsEditing={setIsEditing}
            setIsDisabled={setIsDisabled}
          />
          <DeleteButton
            threadId={threadId}
            requestId={requestId}
            responseId={responseId}
          />
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
        </div>
        <div
          className='w-full flex items-center justify between'
          style={{ paddingRight: isNew ? 16 : 0, paddingLeft: isNew ? 16 : 0, gap: isNew ? 16 : 0 }}
        >
          <textarea
            id={`textarea_${requestId}`}
            ref={textareaRef}
            disabled={isDisabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={() => setTimeout(() => {
              setIsDisabled(true);
              setIsEditing(false);
            }, 100)}
            spellCheck='false'
            className='h-fit resize-none text-sm font-medium text-text-primary placeholder:text-text-primary leading-loose focus-visible:outline-none'
            style={{ width: '100%' }}
          />
          <div className='flex items-center'>
            <PauseRunButton
              threadId={threadId}
              requestId={requestId}
              responseId={responseId}
              input={input}
              isDisabled={isDisabled}
              isNew={isNew}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              agentModel={agentModel}
            />
          </div>
        </div>
        {isNew && <div style={{ width: progressBarLength }} className='h-1 mt-3 transition-all duration-300 ease-in-out rounded-r-full bg-text-primary' />}
      </div>
    </div>
  )
};

export default Question;
