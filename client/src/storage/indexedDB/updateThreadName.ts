import { db } from './initialize';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
  threadName: string | null;
}

const updateThreadName = async ({ threadId, threadName }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { name: threadName });
    if (updatedThread === 0) throw new Error('Failed to update thread name');
    dispatchEvent.threadNameUpdated({ threadName });
  } catch (error) {
    console.error('Failed to update thread name (IndexedDB): ', error);
  }
};

export default updateThreadName;