import { Thread } from 'src/types';

interface Props {
  threadId: string;
};

/**
 * Fetches specific thread (PostgresDB).
 * @param {string} props.threadId - The ID of the thread.
 * @returns {Promise<Thread>} - Returns Thread object.
*/
const getThread = async ({ threadId }: Props): Promise<Thread> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Thread | null } = await response.json();
    if (data.data === null) throw new Error(data.message);
    return data.data;

  } catch (error) {
    throw new Error(`Failed to fetch thread (PostgresDB): ${error}`);
  }
};

export default getThread;