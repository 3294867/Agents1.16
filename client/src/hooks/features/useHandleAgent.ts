import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Agent, Team } from 'src/types';

interface Props {
  userId: string;
  teamName: string | undefined;
  agentName: string | undefined; 
}

const useHandleAgent = ({ userId, teamName, agentName }: Props): { team: Team | null, agent: Agent | null, error: string | null, isLoading: boolean } => {
  const [team, setTeam] = useState<Team | null>(null);
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

  return { team, agent, error, isLoading };
};

export default useHandleAgent;