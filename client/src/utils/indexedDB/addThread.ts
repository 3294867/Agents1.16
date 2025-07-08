import { Thread } from 'src/types';
import initializeIndexedDB from './initializeIndexedDB';

const addThread = async (thread: Thread): Promise<void> => {
  try {
    const db = await initializeIndexedDB() as IDBDatabase;

    /** Store data */
    const transaction = db.transaction(['Thread'], 'readwrite');
    const threadStore = transaction.objectStore('Thread');
    threadStore.put(thread);

    transaction.oncomplete = () => {
      db.close();
      console.log('Thread stored successfully in the IDB.');
    };

    transaction.onerror = () => {
      console.error('Transaction error:', transaction.error);
    };

  } catch (error) {
    console.error('Error:', error);
  }
};

export default addThread;