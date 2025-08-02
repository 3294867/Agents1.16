import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  query: Query;
}

/** Adds new query to the thread's body (IndexedDB). */
const addQuery = async ({ threadId, query }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const updatedThread = await db.threads.update(threadId, {
      body: [...threadBodyArray, query]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread');

    /** Dispatch queryAdded event (Events) */
    dispatchEvent.queryAdded(threadId, query);

  } catch (error) {
    console.error('Failed to add query (IndexedDB): ', error);
  }
};

export default addQuery;