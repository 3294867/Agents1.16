import { AddAgent } from 'src/types';

interface Props {
  workspaceId: string;
}

const getAvailableAgents = async ({ workspaceId }: Props): Promise<AddAgent[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-available-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch available agents (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: AddAgent[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (!Array.isArray(data.data)) throw new Error(`Incorrect format of availableAgentsData. Expected '[]'`);
    
    return data.data as AddAgent[];
  } catch (error) {
    throw new Error(`Failed to fetch available agents (PostgresDB): ${error}`);
  }
};

export default getAvailableAgents;