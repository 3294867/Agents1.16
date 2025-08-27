import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import progressBarLength from 'src/storage/localStorage/progressBarLength';
import postgresDB from 'src/storage/postgresDB';
import { AgentType } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

/** Handles animated paragraph (UI) */
const useHandleAnimatedParagraph = ({ threadId, requestId, responseId, responseBody, inferredAgentType }: Props): string => {
  const [copy, setCopy] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  /** Animate answer and set progress bar length (UI) */
  useEffect(() => {
    if (isPaused) return;
    let timer: NodeJS.Timeout;
    const animate = () => {
      return new Promise<void>((resolve) => {
        let i = copy.length;
        timer = setInterval(() => {
          if (i < responseBody.length) {
            setCopy(responseBody.slice(0, i + 1));
            const adjustment = responseBody.length < 400 ? .3 : 0
            progressBarLength.update(String(i/responseBody.length + adjustment));
            i++;
          } else {
            clearInterval(timer);
            progressBarLength.update('0');
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
          progressBarLength.update('0');
          const updateResponseBody = await postgresDB.updateResponseBody({
            responseId: event.detail.responseId,
            responseBody: copy
          });
          await indexedDB.pauseResponse({
            threadId,
            requestId,
            responseBody: updateResponseBody,
            inferredAgentType
          });
        };
        update();
      }
    };
    window.addEventListener('responsePaused', handleQueryPaused as EventListener);
    return () => window.removeEventListener('responsePaused', handleQueryPaused as EventListener);
  }, [threadId, requestId, copy, inferredAgentType]);

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