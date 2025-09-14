import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import postgresDB from 'src/storage/postgresDB';
import { Agent, Tab } from 'src/types';

interface Props {
  workspaceName: string | undefined;
  agentName: string | undefined;
}

const useHandleAgent = ({ workspaceName, agentName }: Props): { agent: Agent | null, error: string | null, isLoading: boolean } => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!workspaceName || !agentName) {
      setError('All props are required: workspaceName, agentName');
      setIsLoading(false);
      return;
    }
    
    const init = async () => {
      try {
        const workspaceIdIDB = await indexedDB.getWorkspaceId({ workspaceName });
        const getAgentIDB = await indexedDB.getAgent({ workspaceId: workspaceIdIDB, agentName });
        if (!getAgentIDB) {
          const getAgentPGDB = await postgresDB.getAgent({ workspaceId: workspaceIdIDB, agentName });
          await indexedDB.addAgent({ agent: getAgentPGDB });
          
          const loadSavedTabs = tabsStorage.load({ workspaceName, agentName });
          if (!loadSavedTabs || loadSavedTabs.length === 0) {
            const { id, createdAt, updatedAt } = await postgresDB.addThread({ agentId: getAgentPGDB.id });
            await indexedDB.addNewThread({ id, agentId: getAgentPGDB.id, createdAt, updatedAt});
            const newTab: Tab = { id, workspaceId: workspaceIdIDB, agentId: getAgentPGDB.id, name: null, isActive: true };
            tabsStorage.add({ workspaceName, agentName, newTab });
            setIsLoading(false);
            navigate(`/${workspaceName}/${agentName}/${id}`, { replace: true });
          } else {
            setIsLoading(false);
            navigate(`/${workspaceName}/${agentName}/${loadSavedTabs[0].id}`, { replace: true });
          }
          setAgent(getAgentPGDB);
          return;
        }

        const loadSavedTabs = tabsStorage.load({ workspaceName, agentName });
        if (!loadSavedTabs || loadSavedTabs.length === 0) {
          const { id, createdAt, updatedAt } = await postgresDB.addThread({ agentId: getAgentIDB.id });
          await indexedDB.addNewThread({ id, agentId: getAgentIDB.id, createdAt, updatedAt});
          const newTab: Tab = { id, workspaceId: workspaceIdIDB, agentId: getAgentIDB.id, name: null, isActive: true };
          tabsStorage.add({ workspaceName, agentName, newTab });
          setIsLoading(false);
          navigate(`/${workspaceName}/${agentName}/${id}`, { replace: true });
        } else {
          setIsLoading(false);
          const activeTabId = loadSavedTabs.filter((t: Tab) => t.isActive === true)[0].id;
          navigate(`/${workspaceName}/${agentName}/${activeTabId}`, { replace: true });
        }
        
        setAgent(getAgentIDB);
      } catch (error) {
        setError(`Failed to fetch agent: ${error}`);
      }
    };
    init();
  }, [workspaceName, agentName]);

  return { agent, error, isLoading };
};

export default useHandleAgent;