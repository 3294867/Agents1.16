import { useEffect, useState } from 'react';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Tab } from 'src/types';

interface Props {
  workspaceName: string;
  agentName: string;
}

interface Return {
  tabs: Tab[] | null,
  isLoading: boolean,
  error: string | null
}

const useHandleTabs = ({ workspaceName, agentName }: Props): Return => {
  const [tabs, setTabs] = useState<Tab[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceName || !agentName) {
      setError('Missing required props: workspaceName, agentName');
      return;
    };

    try {
      const handleUpdates = () => {
        const loadSavedTabs = tabsStorage.load({ workspaceName, agentName });
        if (loadSavedTabs) setTabs(loadSavedTabs);
      };
      handleUpdates();
      
      window.addEventListener('tabsUpdated', handleUpdates as EventListener);
      window.addEventListener('threadNameUpdated', handleUpdates as EventListener);
      
      return () => {
        window.removeEventListener('tabsUpdated', handleUpdates as EventListener);
        window.removeEventListener('threadNameUpdated', handleUpdates as EventListener);
      }
    } catch (err) {
      setError(`Failed to fetch tabs: ${err}`);
    } finally {
      setIsLoading(false)
    }
  },[workspaceName, agentName]);

  return { tabs, isLoading, error };
};

export default useHandleTabs;