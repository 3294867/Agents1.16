import { useParams } from 'react-router-dom';
import { indexedDB } from 'src/storage/indexedDB';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const thread = indexedDB.getThread(threadId);
  if (!thread) return null;

  return (
    <div className='text-white'>
      <p>{JSON.stringify(thread)}</p>
    </div>
  );
};

export default Thread;