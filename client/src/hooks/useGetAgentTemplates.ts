import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import { Agent, AgentTemplate } from 'src/types';

interface Props {
  addedAgents: Agent[];
}

const useGetAgentTemplates = ({ addedAgents }: Props): AgentTemplate[] | null => {
  const [agentTemplates, setAgentTemplates] = useState<AgentTemplate[] | null>(null);
  const addedAgentsTypes = addedAgents.map(a => a.type);

  useEffect(() => {
    const getAgentTemplates = async () => {
      try {
        const agentTemplatesPostgres: AgentTemplate[] = await postgresDB.getAgentTemplates();
        const filteredAgentTemplates = agentTemplatesPostgres.filter(a => !addedAgentsTypes.includes(a.type));
        setAgentTemplates(filteredAgentTemplates);
      } catch (error) {
        throw new Error(`Failed to fetch agent templates: ${error}`);
      }
    };
    getAgentTemplates();
  },[addedAgentsTypes]);

  return agentTemplates;
};

export default useGetAgentTemplates;