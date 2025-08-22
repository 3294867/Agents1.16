import { Thread } from 'src/types';

interface Props {
  publicThreadId: string;
  newThreadId: string;
  userId: string;
  agentId: string;
}

const duplicateThread = async ({ publicThreadId, newThreadId, userId, agentId }: Props): Promise<Thread> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/duplicate-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicThreadId, newThreadId, userId, agentId })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error (`Failed to duplicate thread: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: Thread | null } = await response.json();
  if (!data.data) throw new Error('Failed to duplicate thread');
  return data.data as Thread;
};

export default duplicateThread;