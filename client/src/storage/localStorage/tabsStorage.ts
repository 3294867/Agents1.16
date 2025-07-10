import { Tab } from 'src/types';

const tabsStorage = {
  save: (agent: string, tabs: Tab[] ): boolean => {
    try {
      localStorage.setItem(`${agent}_tabs`, JSON.stringify(tabs));
      return true;
    } catch (error) {
      console.error('Failed to save threads: ', error);
      return false
    }
  },

  load: (agent: string): Tab[] | null => {
    try {
      const savedTabs = localStorage.getItem(`${agent}_tabs`);
      if (savedTabs) return JSON.parse(savedTabs);
      return null;
    } catch (error) {
      console.error(`Failed to load tabs: `, error);
      return null;
    }
  },

  addTab: (agent: string, tab: Tab) => {
    try {
      const savedTabs = tabsStorage.load(agent);
      const newTab = {
        id: tab.id,
        agentId: tab.agentId,
        title: tab.title,
        isActive: true,
      }

      if (savedTabs === null) {
        tabsStorage.save(agent, [newTab]);
      } else {
        const updatedTabs: Tab[] = [];
        for (const t of savedTabs) {
          if (t.agentId === tab.agentId) {
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
};

export default tabsStorage;