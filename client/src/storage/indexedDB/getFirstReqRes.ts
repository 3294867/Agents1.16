import { db } from './initialize';
import { ReqRes } from 'src/types';

interface Props {
  threadId: string | undefined;
}

const getFirstReqRes = async ({ threadId }: Props): Promise<ReqRes | null> => {
  if (!threadId) throw new Error('Thread id is required.');
  
  try {
    const thread = await db.threads.where('id').equals(threadId).first();
    if (!thread) throw new Error('Failed to fetch thread (IndexedDB)');
    if (thread.body.length === 0) return null;
    return thread.body[0];
  } catch (error) {
    throw new Error(`Failed to fetch first reqres from the body of the thread (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getFirstReqRes;