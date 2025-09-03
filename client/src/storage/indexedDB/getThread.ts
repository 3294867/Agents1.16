import { db } from './initialize';
import { Thread } from 'src/types';

interface Props {
  threadId: string | undefined;
}

const getThread = async ({ threadId }: Props): Promise<Thread | undefined> => {
  if (!threadId) throw new Error('Thread id is required');
  
  try {
    const thread = await db.threads.where('id').equals(threadId).first();
    return thread;
  } catch (error) {
    throw new Error(`Failed to fetch thread (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getThread;