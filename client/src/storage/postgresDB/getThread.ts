import { Thread } from 'src/types';

interface Request {
  threadId: string;
};

/**
 * Get thread.
 * 
 * @param {string} props.threadId - Thread id.
 * @returns {Object} - Data object.
*/
const getThread = async (props: Request): Promise<Thread> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: props.threadId
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: Thread | null } = await response.json();
  if (data.data === null) throw new Error(data.message);
  return data.data;
};

export default getThread;