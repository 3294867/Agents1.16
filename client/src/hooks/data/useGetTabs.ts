import { useEffect, useState } from 'react';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Tab } from 'src/types';

const useGetTabs = (agentName: string) => {
  const [tabs, setTabs] = useState<Tab[] | null>(null);
  const [currentThreadPositionY, setCurrentThreadPositionY] = useState<number>(0);

  /** Fetch tabs (localStorage) */
  useEffect(() => {
    if (!agentName) return;
    const savedTabs = tabsStorage.load(agentName);
    if (savedTabs !== null) setTabs(savedTabs);
    
    const handleTabsUpdate = (event: CustomEvent) => {
      if (event.detail.agent === agentName) {
        const savedTabs = tabsStorage.load(agentName);
        if (savedTabs !== null) setTabs(savedTabs);
      }
    };
    window.addEventListener('tabsUpdated', handleTabsUpdate as EventListener);

    return () => {
      setTabs(null);
      window.removeEventListener('tabsUpdated', handleTabsUpdate as EventListener);
    }
  },[agentName]);

  /** Set 'positionY' property of the current thread */
  useEffect(() => {
    const handleScroll = () => setCurrentThreadPositionY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { tabs, currentThreadPositionY };
};

export default useGetTabs;