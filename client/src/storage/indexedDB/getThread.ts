import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

interface Props {
  threadId: string | undefined;
};

/** Fetches thread (IndexedDB) */
const getThread = async ({ threadId }: Props): Promise<Thread> => {
  if (!threadId) throw new Error('Thread id is required.');
  
  try {
    const thread = await db.threads.where('id').equals(threadId).first();
    if (!thread) throw new Error('Failed to fetch thread (IndexedDB).');
    return thread;
    
  } catch (error) {
    throw new Error(`IndexedDB error: ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getThread;