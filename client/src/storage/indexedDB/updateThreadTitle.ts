import { db } from './initialize';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  threadId: string;
  threadTitle: string | null;
}

const updateThreadTitle = async ({ threadId, threadTitle }: Props): Promise<void> => {
  try {
    const updatedThread = await db.threads.update(threadId, { title: threadTitle });
    if (updatedThread === 0) throw new Error('Failed to update thread title');

    dispatchEvent.threadTitleUpdated(threadId, threadTitle);
    
  } catch (error) {
    console.error('Failed to update thread title (IndexedDB): ', error);
  }
};

export default updateThreadTitle;