import { useEffect, useRef, useState } from 'react';

interface Props {
  input: string;
  isEditing: boolean;
};

/** Handles question */
const useHandleQuestion = ({ input, isEditing }: Props): { textareaRef: React.RefObject<HTMLTextAreaElement | null>, progressBarLength: string } => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [progressBarLength, setProgressBarLength] = useState('');

  /** Auto-resize height of the textarea (UI) */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input, isEditing]);

  /** Focus textarea on edit question */
  useEffect(() => {
    const handleFocusTextArea = (event: CustomEvent) => {
      const textAreaElement = document.getElementById(`textarea_${event.detail.requestId}`) as HTMLTextAreaElement | null;
      if (textAreaElement) {
        textAreaElement.focus();
        textAreaElement.selectionStart = textAreaElement.selectionEnd = textAreaElement.value.length;
        textAreaElement.style.width = '100%';
      }
    };
    window.addEventListener('editingQuestion', handleFocusTextArea as EventListener);
    
    return () => window.removeEventListener('editingQuestion', handleFocusTextArea as EventListener);
  },[])

  /** Set length of the progress bar */
  useEffect(() => {
    const handleProgressBarLengthUpdated = (event: CustomEvent) => {
      setProgressBarLength(`${event.detail.length * 100}%`);
    };
    window.addEventListener('progressBarLengthUpdated', handleProgressBarLengthUpdated as EventListener);
    return () => window.removeEventListener('progressBarLengthUpdated', handleProgressBarLengthUpdated as EventListener);
  },[progressBarLength]);

  return { textareaRef, progressBarLength };
};

export default useHandleQuestion;