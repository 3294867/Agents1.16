import { db } from './initialize';

interface Props {
  threadId: string;
}

const deleteThread = async ({ threadId }: Props): Promise<void> => {
  try {
    await db.threads.delete(threadId);
  } catch (error) {
    throw new Error(`Failed to delete thread (IndexedDB): ${error}`);
  }
};

export default deleteThread;