import constants from 'src/constants';
import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

interface Props {
  thread: Thread;
};

/** Adds new thread (IndexedDB) */
const addThread = async ({ thread }: Props): Promise<void> => {
  try {
    const updatedThread = { ...thread, positionY: constants.initialPositionY };
    await db.threads.add(updatedThread);
  } catch (error) {
    throw new Error(`Failed to add thread (IndexedDB): ${error}`);
  }
};

export default addThread;