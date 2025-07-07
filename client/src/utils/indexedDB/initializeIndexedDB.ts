const initializeIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Agents', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const agentStore = db.createObjectStore('Agent', {
        keyPath: 'id', autoIncrement: true
      });
      const threadStore = db.createObjectStore('Thread', {
        keyPath: 'id', autoIncrement: true
      });
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event: Event) => {
      reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error?.message);
    };
  });
};

export default initializeIndexedDB;