import { Agent, AddAgent } from 'src/types';

interface Props {
  workspaceId: string;
  agentData: AddAgent;
}

const addAgent = async ({ workspaceId, agentData }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, agentData })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    if (data.message !== "Agent added") throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to add agent (PostgresDB): ${error}`);
  }
};

export default addAgent;