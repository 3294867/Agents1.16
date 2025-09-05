import { db } from './initialize';
import dispatchEvent from 'src/events/dispatchEvent';
import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  reqres: ReqRes;
}

/** Adds new reqres to the body of the thread (IndexedDB) */
const addReqRes = async ({ threadId, reqres }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const updatedThread = await db.threads.update(threadId, {
      body: [...threadBodyArray, reqres]
    });
    if (updatedThread === 0) throw new Error('Failed to add reqres to the body of the thread (IndexedDB)');

    dispatchEvent.reqresAdded({ threadId, reqres });
  } catch (error) {
    console.error('Failed to add reqres to the body of the thread (IndexedDB): ', error);
  }
};

export default addReqRes;