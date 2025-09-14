import { db } from './initialize';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
}

const removeThreadName = async ({ threadId }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { name: null });
    if (updatedThread === 0) throw new Error('Failed to remove thread title');

    dispatchEvent.threadNameUpdated({ threadName: null });
    
  } catch (error) {
    console.error('Failed to remove thread title (IndexedDB): ', error);
  }
};

export default removeThreadName;