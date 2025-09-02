import dispatchEvent from 'src/events/dispatchEvent';
import { Tab, Thread } from 'src/types';

const tabsStorage = {
  save: (workspaceName: string, agentName: string, tabs: Tab[] ): boolean => {
    try {
      localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(tabs));
      return true;
    } catch (error) {
      console.error('Failed to save tabs: ', error);
      return false;
    }
  },
  load: (workspaceName: string, agentName: string): Tab[] | null => {
    try {
      const getSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
      if (getSavedTabs) return JSON.parse(getSavedTabs);
      return null;
    } catch (error) {
      console.error('Failed to load tabs: ', error);
      return null;
    }
  },
  update: (workspaceName: string, agentName: string, workspaceId: string, agentId: string, threadId: string, name: string | null) => {
    try {
      const getSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
      if (getSavedTabs) {
        const remainingTabs = JSON.parse(getSavedTabs).filter((tab: Tab) => tab.id !== threadId);
        const updatedTab: Tab = { id: threadId, workspaceId, agentId, name, isActive: true };
        const updatedTabs = [...remainingTabs, updatedTab] as Tab[];

        localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
        dispatchEvent.tabsUpdated(agentName);
      }
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
    }
  },
  addTab: (workspaceName: string, agentName: string, tab: Tab) => {
    try {
      const loadSavedTabs = tabsStorage.load(workspaceName, agentName);
      const newTab = {
        id: tab.id,
        workspaceId: tab.workspaceId,
        agentId: tab.agentId,
        name: tab.name,
        isActive: true,
      }

      if (loadSavedTabs === null) {
        tabsStorage.save(workspaceName, agentName, [newTab]);
      } else {
        const updatedTabs: Tab[] = [];
        for (const t of loadSavedTabs) {
          if (t.agentId === tab.agentId) {
            t.isActive = false;
          };
          updatedTabs.push(t);
        }
        tabsStorage.save(workspaceName, agentName, [...updatedTabs, newTab]);
      }
      dispatchEvent.tabsUpdated(agentName);

    } catch (error) {
      console.error(`Failed to add tab: `, error);
    }
  },
  deleteTab: (workspaceName: string, agentName: string, threadId: string) => {
    try {
      const loadSavedTabs = localStorage.getItem(`${workspaceName}_${agentName}_tabs`);
      if (loadSavedTabs) {
        const threadIndex = JSON.parse(loadSavedTabs).findIndex((t: Thread) => t.id === threadId);
        if (threadIndex === -1) return null;

        const remainingTabs = JSON.parse(loadSavedTabs)
          .filter((t: Tab) => t.id !== threadId)
          .map((t: Tab, idx: number) =>
            idx === threadIndex - 1 ? { ...t, isActive: true } : t
          );

        const updatedTabs = [...remainingTabs] as Tab[];

        localStorage.setItem(`${workspaceName}_${agentName}_tabs`, JSON.stringify(updatedTabs));
        dispatchEvent.tabsUpdated(agentName);
      }
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
    }
  },
};

export default tabsStorage;