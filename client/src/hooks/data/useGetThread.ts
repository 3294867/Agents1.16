import { useEffect, useState } from 'react';
import { indexedDB } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

const useGetThread = (threadId: string | undefined)  => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (!threadId) {
      setError('Missing thread id.');
      return;
    }

    const fetchThread = async () => {
      setIsLoading(true);
      setError(null);

      const threadData = await indexedDB.getThread({ threadId, error, setError });

      if(threadData) {
        setThread(threadData);
      } else {
        setError('Incorrect thread id.');
      }

      setIsLoading(false);
    };

    fetchThread();

    return () => {
      setThread(null);
      setError(null);
      setIsLoading(false);
    }
  },[threadId, error])

  return { thread, error, isLoading };
};

export default useGetThread;