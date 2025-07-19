import { db } from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  threadTitle: string;
};

/**
 * Updates the 'title' property of a thread.
 * @param {threadId} - The ID of the thread to update.
 * @param {threadTitle} - The title of the thread.
 * @returns {Promise<void>} - void.
 */
const updateThreadTitle = async ({ threadId, threadTitle }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { title: threadTitle });
    if (!updatedThread) throw new Error('Failed to update thread title.');

    /** Dispatch threadTitleUpdated event */
    const event = new CustomEvent('threadTitleUpdated', {
      detail: { threadId, threadTitle }
    });
    window.dispatchEvent(event);
    
  } catch (error) {
    console.error('Query status error: ', error);
  }
};

export default updateThreadTitle;