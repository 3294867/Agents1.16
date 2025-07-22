import { useEffect, useRef } from 'react';

interface Props {
  input: string;
};

const useHandleQuestion = ({ input }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    /* Auto-resize width **/
    if (spanRef.current && textareaRef.current) {
      spanRef.current.textContent = input || '';
      if (!input) spanRef.current.innerHTML = '&nbsp;';
      const spanWidth = spanRef.current.offsetWidth;
      textareaRef.current.style.width = spanWidth < 640 ? (spanWidth - 8) + 'px' : 600 + 'px';
    }
    /* Auto-resize height **/
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return { textareaRef, spanRef };
};

export default useHandleQuestion;