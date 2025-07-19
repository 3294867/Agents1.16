import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Query, Thread } from 'src/types';

const useGetThread = (threadId: string | undefined) => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const fetchThread = async () => {
    if (!threadId) {
      setError('Missing thread id.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const threadData = await indexedDB.getThread({ threadId, error, setError });

    if (threadData) {
      setThread(threadData);
    } else {
      setError('Incorrect thread id.');
    }

    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchThread();

    /** Listen for query added events */
    const handleAddQuery = (event: CustomEvent) => {
      if (event.detail.threadId === threadId) {
        const newQuery: Query = event.detail.newQuery;
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          return {
            ...prevThread,
            body: [...prevBody, newQuery]
          };
        });
      }
    };
    window.addEventListener('queryAdded', handleAddQuery as EventListener);

    /** Listen for query isNew flag updates */
    const handleUpdateQueryIsNewFlag = (event: CustomEvent) => {
      if (event.detail.threadId === threadId) {
        if (!thread) return null;
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
    window.addEventListener('queryIsNewFlagUpdated', handleUpdateQueryIsNewFlag as EventListener);

    /** Listen for thread title updates */
    const handleUpdateThreadTitle = (event: CustomEvent) => {
      const threadTitle: string = event.detail.threadTitle;
      if (event.detail.threadId === threadId) {
        if (!thread) return null;
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            title: threadTitle
          }
        });
      }
    };
    window.addEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);

    return () => {
      window.removeEventListener('queryAdded', handleAddQuery as EventListener);
      window.removeEventListener('queryIsNewFlagUpdated', handleUpdateQueryIsNewFlag as EventListener);
      window.removeEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);
      setThread(null);
      setError(null);
      setIsLoading(false);
    }
  },[threadId, error]);

  return { thread, error, isLoading };
};

export default useGetThread;