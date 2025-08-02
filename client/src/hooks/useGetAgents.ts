import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Agent } from 'src/types';

interface Props {
  userId: string;
}

/** Handles fetching agents (IndexedDB, PostgresDB)*/
const useGetAgents = ({ userId }: Props): Agent[] | null => {
  const [agents, setAgents] = useState<Agent[] | null>(null);

  useEffect(() => {
    const getAgents = async () => {
      try {
        const agentsIDB = await indexedDB.getAgents();
        
        const agentsIDBUpdatedAt: {id: string, updatedAt: Date}[] = [];
        for (const agentIDB of agentsIDB) {
          agentsIDBUpdatedAt.push({
            id: agentIDB.id,
            updatedAt: agentIDB.updatedAt
          });
        }

        const agentsPostgresUpdatedAt = await postgresDB.getAgentsUpdatedAt({ userId });
        
        if (agentsIDB.length === 0 ||  agentsIDBUpdatedAt !== agentsPostgresUpdatedAt) {
          const agentsPostgres = await postgresDB.getAgents({ userId });
          await indexedDB.storeAgents({ agents: agentsPostgres });
          setAgents(agentsPostgres);
          return;
        }
        
        setAgents(agentsIDB);
      } catch (error) {
        throw new Error(`Failed to fetch agents: ${error}`);
      }
    };
    getAgents();

  },[userId]);

  return agents;
};

export default useGetAgents;