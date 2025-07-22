import { useState } from 'react';
import hooks from 'src/hooks';
import DeleteButton from './DeleteButton';
import MoveButton from './MoveButton';
import PausePlayButton from './PausePlayButton';

interface Props {
  requestId: string;
  requestBody: string;
  isNew: boolean;
};

const Question = (props: Props) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [input, setInput] = useState(props.requestBody);
  const { textareaRef, spanRef } = hooks.useHandleQuestion({ input });
  
  return (
    <div className='relative w-full flex justify-end pt-13'>
      <div id={`question_${props.requestId}`} className='max-w-[640px] group flex items-end p-2 gap-2 border border-border rounded-xl bg-background-card shadow shadow-black'>
        <textarea
          ref={textareaRef}
          disabled={isDisabled}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck='false'
          className='text-text-primary text-sm font-medium placeholder:text-text-primary resize-none overflow-hidden leading-loose focus-visible:outline-none'
          style={{ minWidth: 40, maxWidth: '100%', minHeight: 20 }}
        />
        <span
          ref={spanRef}
          className='invisible absolute whitespace-pre text-sm font-medium px-3 py-2'
          style={{ left: 0, top: 0, zIndex: -1, pointerEvents: 'none', maxWidth: '100%', overflow: 'hidden' }}
          aria-hidden='true'
        >
          {input || '\u00A0'}
        </span>
        <div className='absolute top-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5'>
          <button
            onClick={() => setIsDisabled(false)}
            className='cursor-pointer text-text-primary/80 flex justify-center items-center h-8 w-8 rounded-full hover:bg-border transition-colors duration-200'
          >
            <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'><path d='M13 21h8'/><path d='m15 5 4 4'/><path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/></svg>
          </button>
          <DeleteButton requestId={props.requestId} />
          <MoveButton requestId={props.requestId} />
        </div>
        <PausePlayButton requestId={props.requestId} isDisabled={isDisabled} />
      </div>
    </div>
  )
};

export default Question;