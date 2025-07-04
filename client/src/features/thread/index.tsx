import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Thread as ThreadType } from 'src/types';
import threadStorage from 'src/utils/localStorage/threadStorage';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    if (!threadId) return;

    const fetchThread = async () => {
      setIsLoading(true);

      const savedThread = threadStorage.load(threadId) as ThreadType | null;
      if (savedThread) {
        setThread(savedThread);
        setIsLoading(false);
        return;
      } else {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-thread`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threadId })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch thread.');
          }
  
          const data: { message: string; data: ThreadType | null } = await response.json();
          if (data.data === null) {
            throw new Error(data.message);
          }
  
          threadStorage.save(data.data);
          setThread(data.data);
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