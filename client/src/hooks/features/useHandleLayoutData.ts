  import { useEffect, useState } from 'react';
  import indexedDB from 'src/storage/indexedDB';
  import postgresDB from 'src/storage/postgresDB';
  import { Agent, Team } from 'src/types';

  interface Props {
    userId: string;
  }

  const useHandleLayoutData = ({ userId }: Props): { teams: Team[] | null, agents: Agent[] | null, error: string | null, isLoading: boolean} => {
    const [agents, setAgents] = useState<Agent[] | null>(null);
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /** Get teams (IndexedDB, PostgresDB) */
    useEffect(() => {
      const getTeams = async () => {
        try {
          if (!userId) {
            setError('User id is required');
            return;
          }
          setIsLoading(true);
          setError(null);

          const getTeamsIDB = await indexedDB.getTeams({ userId });

          const teamsIDBUpdatedAt: { id: string, updatedAt: Date}[] = [];
          for (const teamIDB of getTeamsIDB) {
            teamsIDBUpdatedAt.push({
              id: teamIDB.id,
              updatedAt: teamIDB.updatedAt
            });
          }

          const getTeamsPGDBUpdatedAt = await postgresDB.getTeamsUpdatedAt({ userId });

          if (getTeamsIDB.length === 0 || JSON.stringify(teamsIDBUpdatedAt) !== JSON.stringify(getTeamsPGDBUpdatedAt)) {
            const getTeamsPGDB = await postgresDB.getTeams({ userId });
            await indexedDB.addTeams({ teams: getTeamsPGDB });
            setTeams(getTeamsPGDB);
            setIsLoading(false);
            return;
          }

          setTeams(getTeamsIDB);
          setIsLoading(false);
        } catch (error) {
          throw new Error(`Failed to fetch teams: ${error}`);
        }
      };
      getTeams();
    },[userId]);
    
    /** Get agents (IndexedDB, PostgresDB) */
    useEffect(() => {
      const getAgents = async () => {
        try {
          if (!userId) {
            setError('User id is required');
            return;
          };
          setIsLoading(true);
          setError(null);

          const getAgentsIDB = await indexedDB.getAgents({ userId });
          
          const agentsIDBUpdatedAt: { id: string, updatedAt: Date }[] = [];
          for (const agentIDB of getAgentsIDB) {
            agentsIDBUpdatedAt.push({
              id: agentIDB.id,
              updatedAt: agentIDB.updatedAt
            });
          }

          const getAgentsPGDBUpdatedAt = await postgresDB.getAgentsUpdatedAt({ userId });
          
          if (getAgentsIDB.length === 0 ||  JSON.stringify(agentsIDBUpdatedAt) !== JSON.stringify(getAgentsPGDBUpdatedAt)) {
            const getAgentsPGDB = await postgresDB.getAgents({ userId });
            await indexedDB.addAgents({ agents: getAgentsPGDB });
            setAgents(getAgentsPGDB);
            setIsLoading(false);
            return;
          }
          
          setAgents(getAgentsIDB);
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

    return { teams, agents, error, isLoading };
  };

  export default useHandleLayoutData;