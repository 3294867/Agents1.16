import dispatchEvent from 'src/events/dispatchEvent';
import { Tab, Thread } from 'src/types';

const tabsStorage = {
  save: (teamName: string, agentName: string, tabs: Tab[] ): boolean => {
    try {
      localStorage.setItem(`${teamName}_${agentName}_tabs`, JSON.stringify(tabs));
      return true;
    } catch (error) {
      console.error('Failed to save tabs: ', error);
      return false
    }
  },
  load: (teamName: string, agentName: string): Tab[] | null => {
    try {
      const getSavedTabs = localStorage.getItem(`${teamName}_${agentName}_tabs`);
      if (getSavedTabs) return JSON.parse(getSavedTabs);
      return null;
    } catch (error) {
      console.error(`Failed to load tabs: `, error);
      return null;
    }
  },
  update: (teamName: string, teamId: string, agentName: string, agentId: string, threadId: string, title: string | null) => {
    try {
      const getSavedTabs = localStorage.getItem(`${teamName}_${agentName}_tabs`);
      if (getSavedTabs) {
        const remainingTabs = JSON.parse(getSavedTabs)
          .filter((tab: Tab) => tab.id !== threadId);
        const updatedTab: Tab = { id: threadId, teamId, agentId, title, isActive: true };
        const updatedTabs = [...remainingTabs, updatedTab] as Tab[];

        localStorage.setItem(`${teamName}_${agentName}_tabs`, JSON.stringify(updatedTabs));

        /** Dispatch tabsUpdated event (Events) */
        dispatchEvent.tabsUpdated(agentName);
      }
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
    }
  },
  addTab: (teamName: string, agentName: string, tab: Tab) => {
    try {
      const loadSavedTabs = tabsStorage.load(teamName, agentName);
      const newTab = {
        id: tab.id,
        teamId: tab.teamId,
        agentId: tab.agentId,
        title: tab.title,
        isActive: true,
      }

      if (loadSavedTabs === null) {
        tabsStorage.save(teamName, agentName, [newTab]);
      } else {
        const updatedTabs: Tab[] = [];
        for (const t of loadSavedTabs) {
          if (t.agentId === tab.agentId) {
            t.isActive = false;
          };
          updatedTabs.push(t);
        }
        tabsStorage.save(teamName, agentName, [...updatedTabs, newTab]);
      }

      /** Dispatch tabsUpdated event (Events) */
      dispatchEvent.tabsUpdated(agentName);

    } catch (error) {
      console.error(`Failed to add tab: `, error);
    }
  },
  deleteTab: (teamName: string, agentName: string, threadId: string) => {
    try {
      const loadSavedTabs = localStorage.getItem(`${teamName}_${agentName}_tabs`);
      if (loadSavedTabs) {
        const threadIndex = JSON.parse(loadSavedTabs).findIndex((t: Thread) => t.id === threadId);
        if (threadIndex === -1) return null;

        const remainingTabs = JSON.parse(loadSavedTabs)
          .filter((t: Tab) => t.id !== threadId)
          .map((t: Tab, idx: number) =>
            idx === threadIndex - 1 ? { ...t, isActive: true } : t
          );

        const updatedTabs = [...remainingTabs] as Tab[];
        localStorage.setItem(`${teamName}_${agentName}_tabs`, JSON.stringify(updatedTabs));

        /** Dispatch tabsUpdated event (Events) */
        dispatchEvent.tabsUpdated(agentName)
      }
    } catch (error) {
      console.error(`Failed to udpate tabs: `, error);
    }
  },
};

export default tabsStorage;