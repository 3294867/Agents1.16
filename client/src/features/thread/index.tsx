import { useParams } from 'react-router-dom';
import { indexedDB } from 'src/storage/indexedDB';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { thread, isLoading, isError } = indexedDB.getThread(threadId);
  if (!thread) return null;

  if (isLoading) return <div className='text-white'>Loading...</div>;
  if (isError) return <div className='text-whtie'>Error</div>;

  return (
    <div className='text-white'>
      <p>{JSON.stringify(thread)}</p>
    </div>
  );
};

export default Thread;