import { db } from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  positionY: number;
};

/**
 * Updates the 'positionY' property of a thread (IndexedDB).
 * @param {string} props.threadId - The ID of the thread to update.
 * @param {number} props.positionY - Current positionY of the thread.
 * @returns {Promise<void>} - Does not have a return value.
 */
const updateThreadPositionY = async ({ threadId, positionY }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { positionY });
    if (updatedThread === 0) throw new Error('Failed to update positionY of the thread.');
    
  } catch (error) {
    console.error('Failed to update positionY of the thread (IndexedDB): ', error);
  }
};

export default updateThreadPositionY;