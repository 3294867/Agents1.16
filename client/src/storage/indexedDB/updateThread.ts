import { db } from './initialize';
import dispatchEvent from 'src/events/dispatchEvent';
import { Thread } from 'src/types';

interface Props {
  thread: Thread;
}

const updateThread = async ({ thread }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(thread.id, { ...thread });
    if (updatedThread === 0) throw new Error('Failed to update thread');
    dispatchEvent.threadUpdated({ threadId: thread.id, thread });
  } catch (error) {
    console.error('Failed to update thread (IndexedDB): ', error);
  }
};

export default updateThread;