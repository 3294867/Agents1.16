import { useState } from 'react';
import hooks from 'src/hooks';
import dispatchEvent from 'src/events/dispatchEvent';
import PauseRunButton from './PauseRunButton';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';
import { AgentModel } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
  requestBody: string;
  responseId: string;
  isNew: boolean;
  agentModel: AgentModel;
};

const Question = ({ threadId, requestId, requestBody, responseId, isNew, agentModel }: Props) => {
  const [input, setInput] = useState(requestBody);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { textareaRef, spanRef } = hooks.useHandleQuestion({ input, isEditing });
  
  const progressBarWidth = '67%';

  const handleEdit = () => {
    const update = () => {
      return new Promise<void>((resolve) => {
        dispatchEvent.responsePaused(requestId);
        setIsDisabled(false);
        setIsEditing(true);
        resolve();
      });
    };
    update().then(() => dispatchEvent.editingQuestion(requestId));
  };

  return (
    <div className='relative w-full flex justify-end pt-13'>
      <div id={`question_${requestId}`} className='group overflow-hidden flex flex-col p-0 pt-2 border border-border rounded-xl shadow-sm shadow-black bg-background-card'>
        <div className='w-full px-2 flex items-end gap-2'>
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
            className='text-text-primary text-sm font-medium placeholder:text-text-primary resize-none overflow-hidden leading-loose focus-visible:outline-none'
            style={{ minWidth: 120, maxWidth: '100%', minHeight: 20, width: isEditing ? 540 : undefined }}
          />
          <span
            ref={spanRef}
            className='invisible absolute whitespace-pre text-sm font-medium px-3 py-2'
            style={{ left: 0, top: 0, zIndex: -1, pointerEvents: 'none', maxWidth: '100%', overflow: 'hidden' }}
            aria-hidden='true'
          >
            {input || '\u00A0'}
          </span>
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
        <div className='absolute top-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5'>
          <button onClick={handleEdit} className='cursor-pointer text-text-primary flex justify-center items-center h-8 w-8 rounded-full hover:bg-border transition-colors duration-200'>
            <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M13 21h8'/><path d='m15 5 4 4'/><path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/></svg>
          </button>
          <DeleteButton requestId={requestId} />
          <MoveButton requestId={requestId} />
        </div>
        {isNew && <div style={{ width: progressBarWidth }} className='h-1 mt-1 transition-all duration-300 ease-in-out rounded-r-full bg-text-primary'/>}
      </div>
    </div>
  )
};

export default Question;