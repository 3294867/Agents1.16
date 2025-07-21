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

  const thread = { ...data.data, positionY: 0 };
  const tab = {
    id: data.data.id,
    agentId: data.data.agentId,
    title: data.data.title,
    isActive: true
  };

  tabsStorage.addTab(agentName, tab);
  await db.threads.add(thread);
  
  return data.data;
};

export default createThread;