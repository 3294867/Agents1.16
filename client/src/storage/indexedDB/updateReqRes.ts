import { db } from './initialize';
import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  reqres: ReqRes;
}

const updateReqRes = async ({ threadId, reqres }: Props): Promise<number | null> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const reqresIndex = threadBodyArray.findIndex(i => i.requestId === reqres.requestId);
    const updatedBody: ReqRes[] = threadBodyArray.map((item, idx) =>
      idx === reqresIndex ? reqres : item
    );
    
    const updatedThread = await db.threads.update(threadId, {
      body: [...updatedBody]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread');

    return reqresIndex;
  } catch (error) {
    console.error('Failed to add reqres (IndexedDB): ', error);
    return null;
  }
};

export default updateReqRes;