import { useEffect, useRef } from 'react';

interface Props {
  input: string;
  isEditing: boolean;
}

const useHandleQuestion = ({ input, isEditing }: Props): { textareaRef: React.RefObject<HTMLTextAreaElement | null> } => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Auto-resize height of the textarea (UI) */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input, isEditing]);

  /** Focus textarea on edit question (UI) */
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

  return { textareaRef };
};

export default useHandleQuestion;