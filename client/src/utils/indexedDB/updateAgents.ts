import { Agent } from 'src/types';
import initializeIndexedDB from './initializeIndexedDB';

const updateAgents = async (userId: string): Promise<void> => {
  try {
    const db = await initializeIndexedDB() as IDBDatabase;

    /** Fetch data */
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: { message: string, data: Agent[] | null } = await response.json();
    if (data.data === null) throw new Error(data.message);

    /** Store data */
    for (const agent of data.data) {
      const transaction = db.transaction(['Agent'], 'readwrite');
      const agentStore = transaction.objectStore('Agent');
      agentStore.put(agent);

      transaction.oncomplete = () => {
        db.close();
        console.log('Data stored successfully in IndexedDB');
      };
  
      transaction.onerror = () => {
        console.error('Transaction error:', transaction.error);
      };
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

export default updateAgents;