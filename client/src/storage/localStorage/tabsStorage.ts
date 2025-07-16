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

  update: (agent: string, agentId: string, threadId: string, newTitle: string) => {
    try {
      const savedTabs = localStorage.getItem(`${agent}_tabs`);
      if (savedTabs) {
        const remainingTabs = JSON.parse(savedTabs).filter((tab: { id: string, title: string, isActive: boolean }) => tab.id !== threadId);
        const updatedTab: Tab = { id: threadId, agentId, title: newTitle, isActive: true };
        const updatedTabs = [...remainingTabs, updatedTab] as Tab[];

        localStorage.setItem(`${agent}_tabs`, JSON.stringify(updatedTabs));

        /** Dispatch event */
        const event = new CustomEvent('tabsUpdated', {
          detail: { agent: agent }
        });
        window.dispatchEvent(event);
      }
      return null;
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
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