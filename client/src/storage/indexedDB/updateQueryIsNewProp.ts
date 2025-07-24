import dispatchEvent from 'src/events/dispatchEvent';
import { db } from 'src/storage/indexedDB';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  responseId: string;
  isNew: boolean;
};

/** Updates the 'isNew' property of a specific query in a thread's body (IndexedDB) */
const updateQueryIsNewProp = async ({ threadId, responseId, isNew }: Props): Promise<void> => {
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
    if (updatedThread === 0) throw new Error('Failed to update isNew property.');

    /** Dispatch queryIsNewUpdated event (Events) */
    dispatchEvent.queryIsNewUpdated(threadId, responseId, isNew);

  } catch (error) {
    console.error('Failed to update isNew property (IndexedDB): ', error);
  }
};

export default updateQueryIsNewProp;