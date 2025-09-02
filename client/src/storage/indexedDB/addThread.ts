import constants from 'src/constants';
import { db } from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const addThread = async ({ threadId, agentId, createdAt, updatedAt }: Props): Promise<void> => {
  try {
    const thread = {
      id: threadId,
      name: null,
      body: [],
      isBookmarked: false,
      isShared: false,
      isActive: true,
      agentId,
      positionY: constants.initialPositionY,
      createdAt,
      updatedAt
    };
    const addThread = await db.threads.add(thread);
    if (!addThread) throw new Error('Failed to add thread (IndexedDB)');
  } catch (error) {
    throw new Error(`Failed to add thread (IndexedDB): ${error}`);
  }
};

export default addThread;