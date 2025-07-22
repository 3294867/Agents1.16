import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Query, Thread } from 'src/types';

interface Props {
  threadId: string | undefined;
};

/**
 * Handles thread.
 * @param {string} props.threadId - ID of the thread.
 * @returns {Object} - Returns thread, error, isLoading.
*/
const useHandleThread = ({ threadId }: Props): { thread: Thread | null, error: string | null, isLoading: boolean } => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ newRequestId, setNewRequestId ] = useState<string | null>(null);

  /** Get thread (IndexedDB) */
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) {
        setError('Missing thread id.');
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      const threadData = await indexedDB.getThread({ threadId });
      if (!threadData) setError('Incorrect thread id.')
      setThread(threadData);
      setIsLoading(false);
    };
    fetchThread();
  },[threadId]);

  /** Scroll to saved 'positionY' value of the thread */
  useEffect(() => {
    if (thread) {
      scrollTo({
        top: thread.positionY,
        behavior: 'smooth'
      });
    }
  },[thread]);
  
  /** Update thread on query added event (Events) */
  useEffect(() => {
    const handleAddQuery = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          return {
            ...prevThread,
            body: [...prevBody, event.detail.query]
          };
        });
  
        setNewRequestId(event.detail.query.requestId);
      }
    };
    window.addEventListener('queryAdded', handleAddQuery as EventListener);

    return () => window.removeEventListener('queryAdded', handleAddQuery as EventListener);
  },[threadId]);

  /** Scroll to the new query */
  useEffect(() => {
    if (thread && newRequestId) {
      const question = document.getElementById(`question_${newRequestId}`);
      if (!question) return;
      const rect = question.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPositionY = rect.top + scrollTop - 8;

      scrollTo({
        top: offsetPositionY,
        behavior: 'smooth'
      });
    }
  },[thread, newRequestId]);


  /** Update thread on queryIsNewUpdated event (Events) */
  useEffect(() => {
    const handleUpdateQueryIsNewProperty = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId) {
        if (!thread) return;
        const threadBody = Array.isArray(thread.body) ? thread.body : [];
        const queryIndex = threadBody.findIndex(q => q.responseId === event.detail.responseId);
        if (queryIndex === -1) return;
  
        const isNew: boolean = event.detail.isNew;
        const updatedThreadBody: Query[] = threadBody.map((q, idx) =>
          idx === queryIndex ? { ...q, isNew } : q
        );
  
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            body: updatedThreadBody
          };
        });
      }
    };
    window.addEventListener('queryIsNewUpdated', handleUpdateQueryIsNewProperty as EventListener);

    return () => window.removeEventListener('queryIsNewUpdated', handleUpdateQueryIsNewProperty as EventListener);
  },[thread, threadId]);

  /** Update thread on threadTitleUpdated event (Events) */
  useEffect(() => {
    const handleUpdateThreadTitle = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId) {
        if (!thread) return;
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            title: event.detail.threadTitle
          }
        });
      }
    };
    window.addEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);

    return () => {
      window.removeEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);
    }
  },[threadId]);

  return { thread, error, isLoading };
};

export default useHandleThread;