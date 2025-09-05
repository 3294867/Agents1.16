import { db } from './initialize';
import dispatchEvent from 'src/events/dispatchEvent';
import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
}

const deleteReqRes = async ({ threadId, requestId }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const updatedThreadBody = threadBodyArray.filter((q: ReqRes) => q.requestId !== requestId);
    const updatedThread = await db.threads.update(threadId, {
      body: [...updatedThreadBody]
    });
    if (updatedThread === 0) throw new Error('Failed to remove reqres from the body of the thread (IndexedDB)');
    dispatchEvent.reqresDeleted({ threadId, requestId });
  } catch (error) {
    console.error('Failed to remove reqres from the body of the thread (IndexedDB): ', error);
  }
};

export default deleteReqRes;