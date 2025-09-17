import { db } from './initialize';
import { Thread } from 'src/types';

interface Props {
  thread: Thread;
}

const addThread = async ({ thread }: Props): Promise<void> => {
  try {
    const addedThreadId = await db.threads.put(thread);
    if (addedThreadId !== thread.id) throw new Error('Failed to add thread');
  } catch (error) {
    console.error('Failed to add thread (IndexedDB): ', error);
  }
};

export default addThread;