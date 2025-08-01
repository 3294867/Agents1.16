import { db } from 'src/storage/indexedDB';
import { Query } from 'src/types';

interface Props {
  threadId: string | undefined;
}

/** Fetches first query of the thread (IndexedDB) */
const getFirstQuery = async ({ threadId }: Props): Promise<Query | null> => {
  if (!threadId) throw new Error('Thread id is required.');
  
  try {
    const thread = await db.threads.where('id').equals(threadId).first();
    if (!thread) throw new Error('Failed to fetch thread (IndexedDB).');
    if (thread.body.length === 0) return null;
    return thread.body[0];
  } catch (error) {
    throw new Error(`IndexedDB error: ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getFirstQuery;