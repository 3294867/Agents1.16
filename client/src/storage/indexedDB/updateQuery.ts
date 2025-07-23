import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  query: Query;
};

/** Updates query in the thread body on edited question (IndexedDB). */
const updateQuery = async ({ threadId, query }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found.');
    
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const remainingQueries = threadBodyArray.filter(q => q.requestId !== query.requestId );
    
    const updatedThread = await db.threads.update(threadId, {
      body: [...remainingQueries, query]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread.');

    /** Dispatch queryUpdated event (Events) */
    dispatchEvent.queryUpdated(threadId, query);

  } catch (error) {
    console.error('Failed to add query (IndexedDB): ', error);
  }
}

export default updateQuery;