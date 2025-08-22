import { Thread } from 'src/types';

interface Props {
  id: string;
  userId: string;
  agentId: string;
}

const addThread = async ({ id, userId, agentId }: Props): Promise<Thread> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, userId, agentId
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error (`Failed to add thread: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: Thread | null } = await response.json();
  if (!data.data) throw new Error('Failed to add thread');
  return data.data as Thread;
};

export default addThread;