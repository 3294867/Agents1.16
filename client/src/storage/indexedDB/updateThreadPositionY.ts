import { db } from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  positionY: number;
};

/** Updates 'positionY' property of the thread (IndexedDB) */
const updateThreadPositionY = async ({ threadId, positionY }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { positionY });
    if (updatedThread === 0) throw new Error('Failed to update positionY of the thread.');
    
  } catch (error) {
    console.error('Failed to update positionY of the thread (IndexedDB): ', error);
  }
};

export default updateThreadPositionY;