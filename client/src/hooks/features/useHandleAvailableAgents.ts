import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import { Agent } from 'src/types';

interface Props {
  addedAgents: Agent[];
}

const useHandleAvailableAgents = ({ addedAgents }: Props): Agent[] | null => {
  const [availableAgents, setAvailableAgents] = useState<Agent[] | null>(null);
  const addedAgentsTypes = addedAgents.map(a => a.type);

  useEffect(() => {
    const getAvailableAgents = async () => {
      try {
        const getAvailableAgentsPGDB = await postgresDB.getAvailableAgents();
        const filteredAvailableAgentsPGDB = getAvailableAgentsPGDB.filter(a => !addedAgentsTypes.includes(a.type));
        setAvailableAgents(filteredAvailableAgentsPGDB);
      } catch (error) {
        throw new Error(`Failed to fetch available agents: ${error}`);
      }
    };
    getAvailableAgents();
  },[addedAgentsTypes]);

  return availableAgents;
};

export default useHandleAvailableAgents;