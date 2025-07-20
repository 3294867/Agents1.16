import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Agent } from 'src/types';

const useGetAgent = (agentName: string | undefined) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!agentName) {
      setError('Missing agent name.');
      return;
    }

    const fetchAgent = async () => {
      setIsLoading(true);
      setError(null);
      
      const agentData = await indexedDB.getAgent({ agentName, setError });
      
      if (agentData) {
        setAgent(agentData);
      } else {
        setError('Incorrect agent name.');
      }
      
      setIsLoading(false);
    };
    
    fetchAgent();

    return () => {
      setAgent(null);
      setError(null);
      setIsLoading(false);
    }
  }, [agentName, error]);
  
  return { agent, error, isLoading };
};

export default useGetAgent;