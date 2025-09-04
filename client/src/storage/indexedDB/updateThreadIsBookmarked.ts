import { db } from './initialize';

interface Props {
  threadId: string;
  isBookmarked: boolean;
}

const updateThreadIsBookmarked = async ({ threadId, isBookmarked }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { isBookmarked: !isBookmarked });
    if (updatedThread === 0) throw new Error(`Failed to update 'isBookmarked' property of the thread`);

  } catch (error) {
    console.error(`Failed to update 'isBookmarked' property of the thread (IndexedDB): `, error);
  }
};

export default updateThreadIsBookmarked;