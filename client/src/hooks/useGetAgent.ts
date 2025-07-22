import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  agentName: string | undefined; 
};

/**
 * Handles fetching agent.
 * @param {string} props.userId - ID of the user.
 * @param {string | undefined} props.agentName - Name property of the agent.
 * @returns {Object} - Returns agent, error, and isLoading.
*/
const useGetAgent = ({ userId, agentName }: Props): { agent: Agent | null, error: string | null, isLoading: boolean } => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!agentName) {
      setError('Missing agent name.');
      return;
    }

    try {
      const fetchAgent = async () => {
        setIsLoading(true);
        setError(null);
        
        const agentData = await indexedDB.getAgent({ userId, agentName });
        
        if (agentData) {
          setAgent(agentData);
        } else {
          setError('Incorrect agent name.');
        }
        
        setIsLoading(false);
      };
      
      fetchAgent();
    } catch (error) {
      throw new Error(`Failed to fetch agent: ${error}`);
    }
  }, [userId, agentName]);
  
  return { agent, error, isLoading };
};

export default useGetAgent;