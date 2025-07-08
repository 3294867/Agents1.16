import { Agent } from 'src/types';

const getAgents = (): Promise<Agent[] | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Agents', 1);
  
    request.onsuccess = (event: Event): void => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      const transaction = db.transaction(['Agent'], 'readonly');
      const agentStore = transaction.objectStore('Agent');
  
      const agents = agentStore.getAll();
  
      agents.onsuccess = (event: Event): void => {
        const agents = (event.target as IDBRequest).result as Agent[];
        resolve(agents || null);
      };
  
      agents.onerror = (event: Event): void => {
        console.error('Error getting agents:', event);
        reject(event);
      };
  
      transaction.oncomplete = (event: Event): void => {
        db.close();
        resolve(null);
      };

      transaction.onerror = (event: Event): void => {
        console.error('Error getting agents:', event);
        reject(event);
      };
    };
  });
};

export default getAgents;