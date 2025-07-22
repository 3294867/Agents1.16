import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
  threadTitle: string;
};

/**
 * Updates the 'title' property of a thread (IndexedDB).
 * @param {string} props.threadId - The ID of the thread to update.
 * @param {string} props.threadTitle - The title of the thread.
 * @returns {Promise<void>} - Does not have a return value.
 */
const updateThreadTitle = async ({ threadId, threadTitle }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { title: threadTitle });
    if (updatedThread === 0) throw new Error('Failed to update thread title.');

    dispatchEvent.threadTitleUpdated(threadId, threadTitle);
    
  } catch (error) {
    console.error('Failed to update thread title (IndexedDB): ', error);
  }
};

export default updateThreadTitle;