import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';

interface Props {
  workspaceId: string;
}

const useHandleAgentsDropdown = ({ workspaceId }: Props): { agentNames: string[] | null, error: string | null, isLoading: boolean } => {
  const [agentNames, setAgentNames] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    try {
      if (!workspaceId) {
        setError('All props are required: workspaceId');
        return;
      }
      setIsLoading(true);

      const getAgentNames = async () => {
        const getAgentNamesPGDB = await postgresDB.getAgentNames({ workspaceId });
        setAgentNames(getAgentNamesPGDB);
      };
      getAgentNames();

      setIsLoading(false);
    } catch (error) {
      throw new Error(`Failed to fetch agent names: ${error}`);
    }
  }, [workspaceId]);

  return { agentNames, error, isLoading };
};

export default useHandleAgentsDropdown;
