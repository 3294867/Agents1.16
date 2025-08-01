import { db } from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  requestId: string;
  responseBody: string;
}

/** Updates query on pause (IndexedDB) */
const pauseResponse = async ({ threadId, requestId, responseBody }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    const threadBodyArray = Array.isArray(savedThread?.body) ? savedThread.body : [];
    if (!savedThread) throw new Error('Thread not found.');

    const savedQuery = threadBodyArray.find(q => q.requestId === requestId);
    if (!savedQuery) throw new Error('Query not found.')
      
    const updatedQuery = {
      requestId: savedQuery.requestId,
      requestBody: savedQuery.requestBody,
      responseId: savedQuery.responseId,
      responseBody,
      isNew: false
    };

    const filteredThreadBodyArray = threadBodyArray.filter(q => q.requestId !== requestId);
      
    const updatedThread = await db.threads.update(threadId, {
      body: [...filteredThreadBodyArray, updatedQuery]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread.');


  } catch (error) {
    console.error('Failed to add query (IndexedDB): ', error);
  }
};

export default pauseResponse;