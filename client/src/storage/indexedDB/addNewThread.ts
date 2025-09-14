import { db } from './initialize';
import constants from 'src/constants';

interface Props {
  id: string;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const addNewThread = async ({ id, agentId, createdAt, updatedAt }: Props): Promise<void> => {
  try {
    const thread = {
      id,
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

export default addNewThread;