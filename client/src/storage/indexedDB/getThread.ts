import { useEffect, useState } from 'react';
import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

const getThread = (threadId: string | undefined): { thread: Thread | null, isLoading: boolean, isError: boolean } => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

  useEffect(() => {
    try {
      setIsLoading(true);
      if (!threadId) return;
      const fetchThread = async () => {
        const threadData = await db.threads.get({ id: threadId });
        if (threadData) {
          setThread(threadData);
        } else {
          setIsError(true);
        }
        setIsLoading(false);
      };
      fetchThread();
    } catch (error) {
      setIsError(true);
      throw new Error(`Failed to get thread: ${error}`);
    }

    return () => {
      setThread(null);
      setIsLoading(false);
      setIsError(false);
    }
    },[threadId]);

  return { thread, isLoading, isError };
}

export default getThread;