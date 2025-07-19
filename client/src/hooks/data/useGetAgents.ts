import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Agent } from 'src/types';

const useGetAgents = (userId: string) => {
  const [agents, setAgents] = useState<Agent[] | null>(null);

  useEffect(() => {
    const gettingAgents = async () => {
      try {
        const storedAgents = await indexedDB.getAgents();
        if (storedAgents && storedAgents.length > 0) {
          setAgents(storedAgents);
          return;
        }
        
        const fetchedAgents = await postgresDB.getAgents({ userId });
        if (!fetchedAgents) {
          setAgents(null);
          return;
        }
    
        await indexedDB.storeAgents(fetchedAgents);
        setAgents(fetchedAgents);
        return agents;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
    gettingAgents();

    return () => setAgents(null);
  },[userId]);

  return agents;
};

export default useGetAgents;