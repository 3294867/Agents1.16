import { useEffect, useState } from 'react';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
}

const useHandleTabs = ({ workspaceName, agentName }: Props): { tabs: Tab[] | null, currentThreadPositionY: number } => {
  const [tabs, setTabs] = useState<Tab[] | null>(null);
  const [currentThreadPositionY, setCurrentThreadPositionY] = useState<number>(0);

  /** Fetch tabs (localStorage) */
  useEffect(() => {
    if (!workspaceName || !agentName) return;

    try {
      const loadSavedTabs = tabsStorage.load(workspaceName, agentName);
      if (loadSavedTabs !== null) setTabs(loadSavedTabs);

    } catch (error) {
      throw new Error(`Failed to fetch tabs: ${error}`);
    }
  },[workspaceName, agentName]);

  /** Update tabs on: seleted tab, removed tab, or added tab (localStorage) */
  useEffect(() => {
    if (!workspaceName || !agentName) return;
    
    const handleTabsUpdated = (event: CustomEvent) => {
      if (event.detail.agentName === agentName) {
        const loadSavedTabs = tabsStorage.load(workspaceName, agentName);
        if (loadSavedTabs !== null) setTabs(loadSavedTabs);
      }
    };
    window.addEventListener('tabsUpdated', handleTabsUpdated as EventListener);
  
    return () => window.removeEventListener('tabsUpdated', handleTabsUpdated as EventListener);
  },[workspaceName, agentName]);

  /** Update tabs on threadTitleUpdated event (Events) */
  useEffect(() => {
    if (!workspaceName || !agentName) return;
    
    const handleThreadTitleUpdated = () => {
      const loadSavedTabs = tabsStorage.load(workspaceName, agentName);
      if (loadSavedTabs) setTabs(loadSavedTabs);
    };

    window.addEventListener('threadTitleUpdated', handleThreadTitleUpdated as EventListener);
    return () => window.removeEventListener('threadTitleUpdated', handleThreadTitleUpdated as EventListener);
  },[workspaceName, agentName]);

  /** Set 'positionY' property of the current thread (UI) */
  useEffect(() => {
    const handleScroll = () => setCurrentThreadPositionY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { tabs, currentThreadPositionY };
};

export default useHandleTabs;