import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  agentName: string | undefined; 
}

const useGetAgent = ({ userId, agentName }: Props): { agent: Agent | null, error: string | null, isLoading: boolean } => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (!agentName) {
        setError('Missing agent name');
        return;
      }
      const getAgent = async () => {
        setIsLoading(true);
        setError(null);
        
        const agentData = await indexedDB.getAgentByName({ userId, agentName });
        
        if (!agentData) {
          setError('Incorrect agent name');
          return;
        }

        setAgent(agentData);
        setIsLoading(false);
      };
      
      getAgent();
    } catch (error) {
      throw new Error(`Failed to fetch agent: ${error}`);
    }
  }, [agentName, userId]);

  return { agent, error, isLoading };
};

export default useGetAgent;