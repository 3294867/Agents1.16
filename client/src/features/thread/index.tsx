import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getThread from 'src/actions/getThread';
import { db } from 'src/storage/indexedDB/db';
import { Thread as ThreadType } from 'src/types';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    if (!threadId) return;

    const fetchThread = async () => {
      setIsLoading(true);

      const savedThread = await db.threads.get({ id: threadId });
      if (savedThread) {
        setThread(savedThread);
        setIsLoading(false);
        return;
      } else {
        try {
          const thread = await getThread(threadId);
          if (thread) setThread(thread);
        } catch (error) {
          setIsError(error instanceof Error ? error.message : 'An error occured.');
          console.error(error);
        }
      }

      setIsLoading(false);
    };

    fetchThread();

    return () => setThread(null);
  }, [threadId]);

  if (!threadId) return <div className='text-white'>Error: Invalid thread ID</div>;
  if (isLoading) return <div className='text-white'>Loading...</div>;
  if (isError) return <div className='text-white'>Error: {JSON.stringify(isError)}</div>;
  if (!thread) return null;

  return (
    <div className='text-white'>
      <p>{JSON.stringify(thread)}</p>
    </div>
  );
};

export default Thread;