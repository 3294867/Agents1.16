import { Agent } from 'src/types';

interface Props {
  workspaceId: string;
}

const getWorkspaceAgents = async ({ workspaceId }: Props): Promise<Agent[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-workspace-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agents (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as Agent[];
    
  } catch (error) {
    throw new Error(`Failed to fetch agents (PostgresDB): ${error}`);
  }
};

export default getWorkspaceAgents;