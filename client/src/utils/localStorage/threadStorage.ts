import { Thread } from 'src/types';

const threadStorage = {
  save: (thread: Thread ): void => {
    try {
      localStorage.setItem(`thread_${thread.id}`, JSON.stringify(thread));
    } catch (error) {
      console.error('Failed to save thread: ', error);
    }
  },

  load: (threadId: string): Thread | null => {
    try {
      const savedThread = localStorage.getItem(`thread_${threadId}`);
      if (savedThread) return JSON.parse(savedThread);
      return null;
    } catch (error) {
      console.error(`Failed to load thread: `, error);
      return null;
    }
  },

}

export default threadStorage;