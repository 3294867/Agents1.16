import { useEffect, useState } from 'react';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Tab } from 'src/types';

const useGetTabs = (agentName: string) => {
  const [tabs, setTabs] = useState<Tab[] | null>(null);

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

  return tabs;
};

export default useGetTabs;