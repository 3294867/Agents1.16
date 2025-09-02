import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  workspaceName: string | undefined;
  agentName: string | undefined;
}

const useHandleAgent = ({ userId, workspaceName, agentName }: Props): { agent: Agent | null, error: string | null, isLoading: boolean } => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    try {
      if (!userId || !workspaceName || !agentName) {
        setError('All props are required: userId, workspaceName, agentName');
        return;
      }
      setIsLoading(true);

      const getAgent = async () => {
        const workspaceIdIDB = await indexedDB.getWorkspaceId({ workspaceName });
        
        const getAgentIDB = await indexedDB.getAgent({ workspaceId: workspaceIdIDB, agentName });
        if (!getAgentIDB) {
          const getWorkspaceAgentPGDB = await postgresDB.getAgent({ workspaceId: workspaceIdIDB, agentName });
          await indexedDB.addAgent({ agent: getWorkspaceAgentPGDB });
          setAgent(getWorkspaceAgentPGDB);
          return;
        }
        setAgent(getAgentIDB);
      };
      getAgent();

      setIsLoading(false);
    } catch (error) {
      throw new Error(`Failed to fetch agent: ${error}`);
    }
  }, [userId, workspaceName, agentName]);

  return { agent, error, isLoading };
};

export default useHandleAgent;