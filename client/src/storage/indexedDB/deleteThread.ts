import { db } from 'src/storage/indexedDB';

interface Props {
  threadId: string;
};

/** Deletes thread (IndexedDB) */
const deleteThread = async ({ threadId }: Props): Promise<void> => {
  try {
    await db.threads.delete(threadId);
  } catch (error) {
    throw new Error(`Failed to add thread (IndexedDB): ${error}`);
  }
};

export default deleteThread;