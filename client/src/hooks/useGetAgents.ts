import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
};

/** Handles fetching agents */
const useGetAgents = ({ userId }: Props): Agent[] | null => {
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
    
        await indexedDB.storeAgents({ agents: fetchedAgents });
        setAgents(fetchedAgents);
        return agents;
      } catch (error) {
        throw new Error(`Failed to fetch agents: ${error}`);
      }
    };
    gettingAgents();

  },[userId]);

  return agents;
};

export default useGetAgents;