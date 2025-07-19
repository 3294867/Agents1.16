import { db } from 'src/storage/indexedDB';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  responseId: string;
  isNew: boolean;
};

/**
 * Updates the 'isNew' property of a specific query in a thread's body.
 * @param {threadId} - The ID of the thread to update.
 * @param {responseId} - The responseId of the query to update.
 * @param {isNew} - The new value for the isNew property.
 * @returns {Promise<void>} - void.
 */
const updateQueryIsNewFlag = async ({ threadId, responseId, isNew }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found.');
    const body = Array.isArray(savedThread.body) ? savedThread.body : [];
    const queryIndex = body.findIndex(q => q.responseId === responseId);

    /** Create a new array with the updated query, preserving order */
    const updatedBody: Query[] = body.map((q, idx) =>
      idx === queryIndex ? { ...q, isNew } : q
    );

    const updatedThread = await db.threads.update(threadId, { body: updatedBody });
    if (!updatedThread) throw new Error('Failed to update thread.')

    /** Dispatch custom event after successful thread update*/
    const event = new CustomEvent('queryIsNewFlagUpdated', {
      detail: { threadId, responseId, isNew }
    });
    const dispatch = window.dispatchEvent(event);
    if (!dispatch) throw new Error('Failed to dispatch event.')
  } catch (error) {
    console.error('Query status error: ', error);
  }
};

export default updateQueryIsNewFlag;