import { AgentTemplate, AgentType } from 'src/types';

interface Props {
  agentType: AgentType;
}

const getAgentTemplate = async ({ agentType }: Props): Promise<AgentTemplate> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agent-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentType })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agent template (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: AgentTemplate | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as AgentTemplate;
    
  } catch (error) {
    throw new Error(`Failed to fetch agent template (PostgresDB): ${error}`);
  }
};

export default getAgentTemplate;