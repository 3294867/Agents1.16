import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
}

/** Handles animated paragraph (UI) */
const useHandleAnimatedParagraph = ({ threadId, requestId, responseId, responseBody }: Props): string => {
  const [copy, setCopy] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  /** Animate answer (UI) */
  useEffect(() => {
    if (isPaused) return;
    let timer: NodeJS.Timeout;
    const animate = () => {
      return new Promise<void>((resolve) => {
        let i = copy.length;
        timer = setInterval(() => {
          if (i < responseBody.length) {
            setCopy(responseBody.slice(0, i + 1));
            i++;
          } else {
            clearInterval(timer);
            resolve();
          }
        }, 12);
      });
    };

    animate().then(() => {
      indexedDB.updateQueryIsNewProp({
        threadId, responseId, isNew: false
      });
    });

    return () => clearInterval(timer);
  }, [isPaused, copy, responseBody, threadId, responseId]);

  /** Trim answer on pause (Events) */
  useEffect(() => {
    const handleQueryPaused = (event: CustomEvent) => {
      if (event.detail.requestId === requestId) {
        const update = async () => {
          setIsPaused(true);
          await indexedDB.pauseResponse({
            threadId, requestId, responseBody: copy 
          });
        };
        update();
      }
    };
    window.addEventListener('responsePaused', handleQueryPaused as EventListener);
    return () => window.removeEventListener('responsePaused', handleQueryPaused as EventListener);
  }, [threadId, requestId, copy]);

  /** Update copy on updated question (UI) */
  useEffect(() => {
    const handleQueryUpdated = (event: CustomEvent) => {
      if (event.detail.query.requestId === requestId) {
        setCopy('');
        setIsPaused(false);
      }
    };

    window.addEventListener('queryUpdated', handleQueryUpdated as EventListener);
    return () => window.removeEventListener('queryUpdated', handleQueryUpdated as EventListener);
  }, [requestId]);

  return copy;
};

export default useHandleAnimatedParagraph;