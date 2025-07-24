import { Thread } from 'src/types';

interface Props {
  id: string;
  userId: string;
  agentId: string;
};

/** Creates thread (PostgresDB) */
const createThread = async ({ id, userId, agentId }: Props): Promise<Thread> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, userId, agentId
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error (`Failed to create thread: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: Thread | null } = await response.json();
  if (data.data === null) throw new Error('Failed to create thread.');

  return data.data;
};

export default createThread;