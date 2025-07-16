import toast from 'react-hot-toast';
import { db } from 'src/storage/indexedDB';
import { Thread } from 'src/types';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

const createThread = async (id: string, userId: string, agentId: string, agentName: string): Promise<Thread | null> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, userId, agentId
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create thread: ${response.status} ${response.statusText} - ${errorText}`);
    toast('Failed to create thread.');
    return null;
  }

  const data: { message: string, data: Thread | null } = await response.json();

  if (data.data === null) throw new Error('Failed to create thread.')

  tabsStorage.addTab(agentName, data.data);
  await db.threads.add(data.data);
  
  return data.data;
};

export default createThread;