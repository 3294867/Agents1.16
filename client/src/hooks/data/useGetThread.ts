import { useEffect, useState } from 'react';
import { indexedDB } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

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

    /** Listen for thread update events */
    const handleThreadUpdate = (event: CustomEvent) => {
      if (event.detail.threadId === threadId) {
        fetchThread();
      }
    };
    window.addEventListener('threadUpdated', handleThreadUpdate as EventListener);

    return () => {
      setThread(null);
      setError(null);
      setIsLoading(false);
    }
  },[threadId, error])

  return { thread, error, isLoading };
};

export default useGetThread;