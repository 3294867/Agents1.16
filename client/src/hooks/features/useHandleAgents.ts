  import { useEffect, useState } from 'react';
  import indexedDB from 'src/storage/indexedDB';
  import postgresDB from 'src/storage/postgresDB';
  import { Agent } from 'src/types';

  interface Props {
    userId: string;
  }

  const useHandleAgents = ({ userId }: Props): { agents: Agent[] | null, error: string | null, isLoading: boolean} => {
    const [agents, setAgents] = useState<Agent[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /** Get agents (IndexedDB, PostgresDB) */
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

          const agentsPostgresUpdatedAt = await postgresDB.getAgentUpdatedAt({ userId });
          
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

    /** Update agents on agentAdded event (UI) */
    useEffect(() => {
      if (!userId) return;
      const handleAgentAdded = (event: CustomEvent) => {
        setAgents(prevAgents => {
        if (!prevAgents) return [event.detail.agent];
        return [...prevAgents, event.detail.agent];
        });
      };
      window.addEventListener('agentAdded', handleAgentAdded as EventListener);
      return () => window.removeEventListener('agentAdded', handleAgentAdded as EventListener);
    },[userId]);

    return { agents, error, isLoading };
  };

  export default useHandleAgents;