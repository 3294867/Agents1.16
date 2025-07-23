import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
};

const useHandleProgressiveParagraph = ({ threadId, requestId, responseId, responseBody }: Props): string => {
  const [copy, setCopy] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  /** Animates answer (UI) */
  useEffect(() => {
    if (isPaused) return; 
    let timer: NodeJS.Timeout;
    const animate = () => {
      return new Promise<void>((resolve) => {
        let i = 0;
        timer = setInterval(() => {
          if (i < responseBody.length) {
            setCopy(responseBody.slice(0, i + 1));
            i++;
          } else {
            clearInterval(timer);
            resolve();
          }
        },12);
      });
    };

    animate().then(() => {
      indexedDB.updateQueryIsNewProp({
        threadId, responseId, isNew: false
      });
    });
        
    return () => clearInterval(timer);
  },[isPaused, responseBody, threadId, responseId]);

  /** Trimms answer on pause (Events) */
  useEffect(() => {
    const handleQueryPaused = (event: CustomEvent) => {
      if (event.detail.requestId === requestId) {
        setIsPaused(true);
        indexedDB.pauseResponse({
          threadId, requestId, responseBody: copy 
        });
      }
    };
    window.addEventListener('responsePaused', handleQueryPaused as EventListener);
    return () => window.removeEventListener('responsePaused', handleQueryPaused as EventListener);
  },[threadId, requestId, copy]);

  return copy
};

export default useHandleProgressiveParagraph;