import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

interface Props {
  thread: Thread;
};

/**
 * Adds new thread (IndexedDB).
 * @param {string} props.thread - thread to add.
 * @returns {Promise<void>} - Does not have a return value.
 */
const addThread = async ({ thread }: Props): Promise<void> => {
  try {
    const initialPositionY = 0;
    const updatedThread = {...thread, positionY: initialPositionY}
    await db.threads.add(updatedThread);
  } catch (error) {
    throw new Error(`Failed to add thread (IndexedDB): ${error}`);
  }
}

export default addThread;