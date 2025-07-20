import { db } from 'src/storage/indexedDB';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  newQuery: Query;
};

/**
 * Adds new query to the thread's body (IndexedDB).
 * @param {string} props.threadId - The ID of the thread to update.
 * @param {string} props.newQuery - The responseId of the query to update.
 * @returns {Promise<void>} - Does not have a return value.
 */
const addQuery = async ({ threadId, newQuery }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    const threadBodyArray = Array.isArray(savedThread?.body) ? savedThread.body : [];
    if (!savedThread) throw new Error('Thread not found.');
    const updatedThread = await db.threads.update(threadId, {
      body: [...threadBodyArray, newQuery]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread.');

    /** Dispatch custom event after successful thread update */
    const event = new CustomEvent('queryAdded', {
      detail: { threadId, newQuery }
    });
    window.dispatchEvent(event);

  } catch (error) {
    console.error('Failed to add query (IndexedDB): ', error);
  }
}

export default addQuery;