import { db } from 'src/storage/indexedDB/db';
import { Thread } from 'src/types';

const getThread = async (threadId: string): Promise<Thread | null> => {
  try {
    /** Fetch data */
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    });
    if (!response.ok) throw new Error('Failed to fetch thread.');

    const data: { message: string; data: Thread | null } = await response.json();
    if (data.data === null) throw new Error(data.message);

    /** Store data */
    await db.threads.add(data.data);
    return data.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default getThread;