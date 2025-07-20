import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

interface Props {
  threadId: string | undefined;
  setError: (error: string | null) => void;
};

/**
 * Fetches specific thread (IndexedDB).
 * @param {string} props.threadId - The ID of the thread to fetch.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setError - Setter function of a useState hook. 
 * @returns {Promise<Thread | null>} - Returns Thread or null.
 */
const getThread = async ({ threadId, setError }: Props): Promise<Thread | null> => {
  if (!threadId) {
    setError('Thread id is required.');
    return null;
  }
  
  try {
    const thread = await db.threads.where('id').equals(threadId).first();
    if (!thread) return null;
    return thread;
    
  } catch (error) {
    console.error(error);
    setError(`IndexedDB error: ${error instanceof Error ? error.name : 'Unknown error'}`);
    return null;
  }
}

export default getThread;