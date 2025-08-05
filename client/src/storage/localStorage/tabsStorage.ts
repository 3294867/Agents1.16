import dispatchEvent from 'src/events/dispatchEvent';
import { Tab, Thread } from 'src/types';

const tabsStorage = {
  save: (agentName: string, tabs: Tab[] ): boolean => {
    try {
      localStorage.setItem(`${agentName}_tabs`, JSON.stringify(tabs));
      return true;
    } catch (error) {
      console.error('Failed to save threads: ', error);
      return false
    }
  },
  load: (agentName: string): Tab[] | null => {
    try {
      const savedTabs = localStorage.getItem(`${agentName}_tabs`);
      if (savedTabs) return JSON.parse(savedTabs);
      return null;
    } catch (error) {
      console.error(`Failed to load tabs: `, error);
      return null;
    }
  },
  update: (agentName: string, agentId: string, threadId: string, title: string | null) => {
    try {
      const savedTabs = localStorage.getItem(`${agentName}_tabs`);
      if (savedTabs) {
        const remainingTabs = JSON.parse(savedTabs).filter((tab: { id: string, title: string, isActive: boolean }) => tab.id !== threadId);
        const updatedTab: Tab = { id: threadId, agentId, title, isActive: true };
        const updatedTabs = [...remainingTabs, updatedTab] as Tab[];

        localStorage.setItem(`${agentName}_tabs`, JSON.stringify(updatedTabs));

        /** Dispatch tabsUpdated event (Events) */
        dispatchEvent.tabsUpdated(agentName)
      }
      return null;
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
      return null;
    }
  },
  addTab: (agentName: string, tab: Tab) => {
    try {
      const savedTabs = tabsStorage.load(agentName);
      const newTab = {
        id: tab.id,
        agentId: tab.agentId,
        title: tab.title,
        isActive: true,
      }

      if (savedTabs === null) {
        tabsStorage.save(agentName, [newTab]);
      } else {
        const updatedTabs: Tab[] = [];
        for (const t of savedTabs) {
          if (t.agentId === tab.agentId) {
            t.isActive = false;
          };
          updatedTabs.push(t);
        }
        tabsStorage.save(agentName, [...updatedTabs, newTab]);
      }

      /** Dispatch tabsUpdated event (Events) */
      dispatchEvent.tabsUpdated(agentName);

    } catch (error) {
      console.error(`Failed to add tab: `, error);
    }
  },
  deleteTab: (agentName: string, threadId: string): string | null => {
    try {
      const savedTabs = localStorage.getItem(`${agentName}_tabs`);
      if (savedTabs) {
        const threadIndex = JSON.parse(savedTabs).findIndex((t: Thread) => t.id === threadId);
        if (threadIndex === -1) return null;

        const remainingTabs = JSON.parse(savedTabs)
          .filter((t: { id: string, title: string, isActive: boolean }) => t.id !== threadId)
          .map((t: { id: string, title: string, isActive: boolean }, idx: number) =>
            idx === threadIndex - 1 ? { ...t, isActive: true } : t
          );

        const updatedTabs = [...remainingTabs] as Tab[];
        localStorage.setItem(`${agentName}_tabs`, JSON.stringify(updatedTabs));

        /** Dispatch tabsUpdated event (Events) */
        dispatchEvent.tabsUpdated(agentName)
      }
      return null;
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
      return null;
    }
  },
};

export default tabsStorage;