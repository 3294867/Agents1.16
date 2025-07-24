import { useEffect, useState } from 'react';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Tab } from 'src/types';

interface Props {
  agentName: string;
};

/** Handles tabs */
const useHandleTabs = ({ agentName }: Props): { tabs: Tab[] | null, currentThreadPositionY: number } => {
  const [tabs, setTabs] = useState<Tab[] | null>(null);
  const [currentThreadPositionY, setCurrentThreadPositionY] = useState<number>(0);

  /** Fetch tabs (localStorage) */
  useEffect(() => {
    if (!agentName) return;

    try {
      const savedTabs = tabsStorage.load(agentName);
      if (savedTabs !== null) setTabs(savedTabs);
    } catch (error) {
      throw new Error(`Failed to fetch tabs: ${error}`);
    }
  },[agentName]);
  
  /** Update tabs on: seleted tab, removed tab, or added tab (localStorage) */
  useEffect(() => {
    const handleTabsUpdate = (event: CustomEvent) => {
      if (event.detail.agentName === agentName) {
        const savedTabs = tabsStorage.load(agentName);
        if (savedTabs !== null) setTabs(savedTabs);
      }
    };
    window.addEventListener('tabsUpdated', handleTabsUpdate as EventListener);
  
    return () => window.removeEventListener('tabsUpdated', handleTabsUpdate as EventListener);
  },[agentName]);

  /** Set 'positionY' property of the current thread (UI) */
  useEffect(() => {
    const handleScroll = () => setCurrentThreadPositionY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { tabs, currentThreadPositionY };
};

export default useHandleTabs;