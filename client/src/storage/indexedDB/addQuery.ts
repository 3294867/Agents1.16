import { db } from 'src/storage/indexedDB';
import { Query } from 'src/types';

interface updateThreadProps {
  threadId: string;
  newQuery: Query;
};

const addQuery = async (props: updateThreadProps) => {
  try {
    const savedThread = await db.threads.get(props.threadId);
    const threadBodyArray = Array.isArray(savedThread?.body) ? savedThread.body : [];
    if (!savedThread) throw new Error('Thread not found.');
    const updatedThread = await db.threads.update(props.threadId, {
      body: [...threadBodyArray, props.newQuery]
    });
    if (!updatedThread) throw new Error('Failed to update thread.');

    /** Dispatch custom event after successful thread update */
    const event = new CustomEvent('queryAdded', {
      detail: { threadId: props.threadId, newQuery: props.newQuery }
    });
    window.dispatchEvent(event);

  } catch (error) {
    console.error(error);
  }
}

export default addQuery;