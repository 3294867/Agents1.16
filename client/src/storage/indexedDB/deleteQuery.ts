import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
}

/** Adds new query to the thread's body (IndexedDB). */
const deleteQuery = async ({ threadId, requestId }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found.');
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const updatedThreadBody = threadBodyArray.filter((q: Query) => q.requestId !== requestId);
    const updatedThread = await db.threads.update(threadId, {
      body: [...updatedThreadBody]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread.');

    /** Dispatch queryDeleted event (Events) */
    dispatchEvent.queryDeleted(threadId, requestId);

  } catch (error) {
    console.error('Failed to add query (IndexedDB): ', error);
  }
};

export default deleteQuery;