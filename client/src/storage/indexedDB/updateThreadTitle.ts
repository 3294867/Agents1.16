import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
  threadTitle: string | null;
}

/** Updates 'title' property of the thread (IndexedDB) */
const updateThreadTitle = async ({ threadId, threadTitle }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { title: threadTitle });
    if (updatedThread === 0) throw new Error('Failed to update thread title');

    dispatchEvent.threadTitleUpdated(threadId, threadTitle);
    
  } catch (error) {
    console.error('Failed to update thread title (IndexedDB): ', error);
  }
};

export default updateThreadTitle;