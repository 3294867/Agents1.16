import dispatchEvent from 'src/events/dispatchEvent';
import { db } from './initialize';
import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  responseId: string;
  isNew: boolean;
}

const updateReqResIsNew = async ({ threadId, responseId, isNew }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    const body = Array.isArray(savedThread.body) ? savedThread.body : [];
    const reqresIndex = body.findIndex(q => q.responseId === responseId);

    /** Create a new array with the updated reqres, preserving order */
    const updatedBody: ReqRes[] = body.map((q, idx) =>
      idx === reqresIndex ? { ...q, isNew } : q
    );

    const updatedThread = await db.threads.update(threadId, { body: updatedBody });
    if (updatedThread === 0) throw new Error('Failed to update isNew property');
    dispatchEvent.reqresIsNewUpdated({ threadId, responseId, isNew });
  } catch (error) {
    console.error('Failed to update reqres isNew property (IndexedDB): ', error);
  }
};

export default updateReqResIsNew;