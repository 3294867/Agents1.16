import { Thread } from 'src/types';

const getThread = (id: string): Promise<Thread | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Agents', 1);
  
    request.onsuccess = (event: Event): void => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      const transaction = db.transaction(['Thread'], 'readonly');
      const threadStore = transaction.objectStore('Thread');
  
      const agents = threadStore.getAll();
  
      agents.onsuccess = (event: Event): void => {
        const threads = (event.target as IDBRequest).result as Thread[];
        const thread = threads.filter((thread: Thread) => thread.id === id)[0];
        resolve(thread || null);
      };
  
      agents.onerror = (event: Event): void => {
        console.error('Error getting thread:', event);
        reject(event);
      };
  
      transaction.oncomplete = (event: Event): void => {
        db.close();
        resolve(null);
      };

      transaction.onerror = (event: Event): void => {
        console.error('Error getting thread:', event);
        reject(event);
      };
    };
  });
};

export default getThread;