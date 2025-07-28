import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
};

/** Sets 'title' property of the thread to null (IndexedDB) */
const removeThreadTitle = async ({ threadId }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { title: null });
    if (updatedThread === 0) throw new Error('Failed to remove thread title.');

    dispatchEvent.threadTitleUpdated(threadId, null);
    
  } catch (error) {
    console.error('Failed to remove thread title (IndexedDB): ', error);
  }
};

export default removeThreadTitle;