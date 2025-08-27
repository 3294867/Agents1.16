import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Agent, Team } from 'src/types';

interface Props {
  userId: string;
  teamName: string | undefined;
  agentName: string | undefined; 
}

const useHandleAgentData = ({ userId, teamName, agentName }: Props): { team: Team | null, agents: Agent[] | null, agent: Agent | null, error: string | null, isLoading: boolean } => {
  const [team, setTeam] = useState<Team | null>(null);
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** Get team (IndexedDB) */
  useEffect(() => {
    try {
      if (!userId || !teamName) {
        setError('All props are required: userId, teamName');
        return;
      }
      const getTeam = async () => {
        setIsLoading(true);
        setError(null);

        const getTeamIDB = await indexedDB.getTeamByName({ userId, teamName });
        if (!getTeamIDB) {
          setError('Incorrect team name');
          return;
        }

        setTeam(getTeamIDB);
        setIsLoading(false);
      };
      getTeam();
    } catch (error) {
      throw new Error(`Failed to fetch team: ${error}`);
    }
  },[userId, teamName ]);

  /** Get agents (IndexedDB, PostgresDB) */
  useEffect(() => {
    const getAgents = async () => {
      try {
        if (!userId) {
          setError('User id is required');
          return;
        };
        setError(null);
        setIsLoading(true);
        
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

  /** Get agent (IndextedDB) */
  useEffect(() => {
    try {
      if (!userId || !teamName || !agentName) {
        setError('All props are required: userId, teamName, agentName');
        return;
      }
      const getAgent = async () => {
        setIsLoading(true);
        setError(null);
        
        const getAgentIDB = await indexedDB.getAgentByName({ userId, teamName, agentName });
        if (!getAgentIDB) {
          setError('Incorrect agent name');
          return;
        }

        setAgent(getAgentIDB);
        setIsLoading(false);
      };
      getAgent();
    } catch (error) {
      throw new Error(`Failed to fetch agent: ${error}`);
    }
  }, [userId, teamName, agentName]);

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


  return { team, agents, agent, error, isLoading };
};

export default useHandleAgentData;