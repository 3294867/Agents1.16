import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';

interface updateThreadProps {
  thread: Thread;
};

const updateThread = async (props: updateThreadProps) => {
  try {
    const thread = await db.threads.update(props.thread.id, {...props.thread});
    if (!thread) return null;

    /** Dispatch custom event after successful update */
    const event = new CustomEvent('threadUpdated', {
      detail: { threadId: props.thread.id }
    });
    window.dispatchEvent(event);
    
    return thread
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default updateThread;