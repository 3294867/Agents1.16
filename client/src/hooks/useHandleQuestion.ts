import { useEffect, useRef } from 'react';

interface Props {
  input: string;
  isEditing: boolean;
};

const useHandleQuestion = ({ input, isEditing }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  /* Auto-resize width and height of the question (UI) **/
  useEffect(() => {
    if (!isEditing) {
      if (spanRef.current && textareaRef.current) {
        spanRef.current.textContent = input || '';
        if (!input) spanRef.current.innerHTML = '&nbsp;';
        const spanWidth = spanRef.current.offsetWidth;
        textareaRef.current.style.width = spanWidth < 640 ? (spanWidth - 8) + 'px' : 600 + 'px';
      }
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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
        textAreaElement.style.width = 540 + 'px';
      }
    };
    window.addEventListener('editingQuestion', handleFocusTextArea as EventListener);
    
    return () => window.removeEventListener('editingQuestion', handleFocusTextArea as EventListener);
  },[])

  return { textareaRef, spanRef };
};

export default useHandleQuestion;