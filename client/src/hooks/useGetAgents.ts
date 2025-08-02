  import { useEffect, useState } from 'react';
  import indexedDB from 'src/storage/indexedDB';
  import postgresDB from 'src/storage/postgresDB';
  import { Agent } from 'src/types';

  interface Props {
    userId: string;
  }

  /** Handles fetching agents (IndexedDB, PostgresDB)*/
  const useGetAgents = ({ userId }: Props): { agents: Agent[] | null, error: string | null, isLoading: boolean} => {
    const [agents, setAgents] = useState<Agent[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect(() => {
      const getAgents = async () => {
        try {
          if (!userId) {
            setError('Missing user id');
            return;
          };
          setIsLoading(true);
          setError(null);

          const agentsIDB = await indexedDB.getAgents({ userId });
          
          const agentsIDBUpdatedAt: { id: string, updatedAt: Date }[] = [];
          for (const agentIDB of agentsIDB) {
            agentsIDBUpdatedAt.push({
              id: agentIDB.id,
              updatedAt: agentIDB.updatedAt
            });
          }

          const agentsPostgresUpdatedAt = await postgresDB.getAgentsUpdatedAt({ userId });
          
          if (agentsIDB.length === 0 ||  JSON.stringify(agentsIDBUpdatedAt) !== JSON.stringify(agentsPostgresUpdatedAt)) {
            const agentsPostgres = await postgresDB.getAgents({ userId });
            await indexedDB.storeAgents({ agents: agentsPostgres });
            setAgents(agentsPostgres);
            setIsLoading(false);
            return;
          }
          
          setAgents(agentsIDB);
          setIsLoading(false);
        } catch (error) {
          throw new Error(`Failed to fetch agents: ${error}`);
        }
      };
      getAgents();
    },[userId]);

    return { agents, error, isLoading };
  };

  export default useGetAgents;