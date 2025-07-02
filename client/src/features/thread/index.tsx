import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetThreadQuery } from 'src/redux/api';
import { Thread as ThreadType } from 'src/types';
import threadStorage from 'src/utils/localStorage/threadStorage';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const { data, isLoading, isError, error } = useGetThreadQuery(
    { threadId: threadId! },
    { skip: !threadId }
  );

  useEffect(() => {
    if (!threadId) return;

    const savedThread = threadStorage.load(threadId) as ThreadType | null;
    if (savedThread) {
      setThread(savedThread);
      return;
    }

    if (data) {
      threadStorage.save(data);
      setThread(data);
    }
  }, [threadId, data]);

  if (!threadId) return <div className='text-white'>Error: Invalid thread ID</div>;
  if (isLoading) return <div className='text-white'>Loading...</div>;
  if (isError) return <div className='text-white'>Error: {JSON.stringify(error)}</div>;
  if (!thread) return null;

  return (
    <div className='text-white'>
      <h1>{thread.id}</h1>
    </div>
  );
};

export default Thread;