export const browserDB = {
  initialize: () => {
    const request = indexedDB.open('agents');
    let db;
    
    request.onupgradeneeded = function() {
      const db = request.result;
      const agentStore = db.createObjectStore('agent', { keyPath: 'id' });
      const threadStore = db.createObjectStore('thread', { keyPath: 'id' });
    };
    
    request.onsuccess = function() {
      db = request.result;
    };
  }
}