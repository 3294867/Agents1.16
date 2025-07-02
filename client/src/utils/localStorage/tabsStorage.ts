import { Thread } from 'src/types';

const tabsStorage = {
  save: (agent: string, threads: Thread[] ): boolean => {
    try {
      localStorage.setItem(`${agent}_tabs`, JSON.stringify(threads));
      return true;
    } catch (error) {
      console.error('Failed to save threads: ', error);
      return false
    }
  },

  load: (agent: string): Thread[] | null => {
    try {
      const savedTabs = localStorage.getItem(`${agent}_tabs`);
      if (savedTabs) return JSON.parse(savedTabs);
      return null;
    } catch (error) {
      console.error(`Failed to load threads: `, error);
      return null;
    }
  },

}

export default tabsStorage;