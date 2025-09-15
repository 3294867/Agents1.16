import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { AgentType } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
  progressBarLength: number;
  setProgressBarLength: (progressBarLength: number) => void;
}

/** Handles animated paragraph (UI) */
const useHandleAnimatedParagraph = ({ threadId, requestId, responseId, responseBody, inferredAgentType, setProgressBarLength }: Props): string => {
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
            setProgressBarLength(i/responseBody.length + adjustment);
            i++;
          } else {
            clearInterval(timer);
            setProgressBarLength(0);
            resolve();
          }
        }, 12);
      });
    };

    animate().then(() => {
      indexedDB.updateReqResIsNew({
        threadId, responseId, isNew: false
      });
    });

    return () => clearInterval(timer);
  }, [isPaused, copy, responseBody, threadId, responseId]);

  /** Trim answer on pause (Events) */
  useEffect(() => {
    const handleResponsePaused = (event: CustomEvent) => {
      if (event.detail.requestId === requestId) {
        const update = async () => {
          setIsPaused(true);
          setProgressBarLength(0);
          await postgresDB.updateResponseBody({
            responseId: event.detail.responseId,
            responseBody: copy
          });
          await indexedDB.pauseResponse({
            threadId,
            requestId,
            responseBody: copy,
            inferredAgentType
          });
        };
        update();
      }
    };
    window.addEventListener('responsePaused', handleResponsePaused as EventListener);
    return () => window.removeEventListener('responsePaused', handleResponsePaused as EventListener);
  }, [threadId, requestId, copy, inferredAgentType]);

  /** Update copy on updated question (UI) */
  useEffect(() => {
    const handleReqResUpdated = (event: CustomEvent) => {
      if (event.detail.reqres.requestId === requestId) {
        setCopy('');
        setIsPaused(false);
      }
    };

    window.addEventListener('reqresUpdated', handleReqResUpdated as EventListener);
    return () => window.removeEventListener('reqresUpdated', handleReqResUpdated as EventListener);
  }, [requestId]);

  return copy;
};

export default useHandleAnimatedParagraph;