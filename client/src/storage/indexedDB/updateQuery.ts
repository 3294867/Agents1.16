import { db } from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import { Query } from 'src/types';

interface Props {
  threadId: string;
  query: Query;
}

/** Updates query in the thread body on edited question (IndexedDB) */
const updateQuery = async ({ threadId, query }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const queryIndex = threadBodyArray.findIndex(q => q.requestId === query.requestId);
    /** Create a new array with the updated query, preserving order */
    const updatedBody: Query[] = threadBodyArray.map((q, idx) =>
      idx === queryIndex ? query : q
    );
    
    const updatedThread = await db.threads.update(threadId, {
      body: [...updatedBody]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread');

    /** Dispatch queryUpdated event (Events) */
    dispatchEvent.queryUpdated(threadId, query);

  } catch (error) {
    console.error('Failed to add query (IndexedDB): ', error);
  }
};

export default updateQuery;