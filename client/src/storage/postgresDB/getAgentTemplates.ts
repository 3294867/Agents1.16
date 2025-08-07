import { AgentTemplate } from 'src/types';

const getAgentTemplates = async (): Promise<AgentTemplate[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agent-templates`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agent templates (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: AgentTemplate[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as AgentTemplate[];
    
  } catch (error) {
    throw new Error(`Failed to fetch agent templates (PostgresDB): ${error}`);
  }
};

export default getAgentTemplates;