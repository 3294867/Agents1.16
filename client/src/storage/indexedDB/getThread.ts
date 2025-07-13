import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

interface GetThreadProps {
  threadId: string | undefined;
  error: string | null;
  setError: (error: string | null) => void;
};

const getThread = async (props: GetThreadProps): Promise<Thread | null> => {
  if (!props.threadId) {
    props.setError('Thread id is required.');
    return null;
  }
  
  try {
    const thread = await db.threads.where('id').equals(props.threadId).first();
    if (!thread) return null;
    return thread;
  } catch (error) {
    console.error(error);
    props.setError(`IndexedDB error: ${error instanceof Error ? error.name : 'Unknown error'}`);
    return null;
  }
}

export default getThread;