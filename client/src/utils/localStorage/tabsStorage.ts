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

  addTab: (agent: string, thread: Thread) => {
    try {
      const savedTabs = tabsStorage.load(agent);
      const newTab = {
        id: thread.id,
        userId: thread.userId,
        agentId: thread.agentId,
        title: thread.title,
        body: thread.body,
        isActive: true,
        isBookmarked: false,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt
      }

      if (savedTabs === null) {
        tabsStorage.save(agent, [newTab]);
      } else {
        const updatedTabs: Thread[] = [];
        for (const t of savedTabs) {
          if (t.agentId === thread.agentId) {
            t.isActive = false;
          };
          updatedTabs.push(t);
        }
        tabsStorage.save(agent, [...updatedTabs, newTab]);
      }
    } catch (error) {
      console.error(`Failed to add tab: `, error);
    }
  }
}

export default tabsStorage;