import { AddAgent } from 'src/types';

interface Props {
  workspaceId: string;
  agentData: AddAgent;
}

const addAgent = async ({ workspaceId, agentData }: Props): Promise<{ id: string, name: string }> => {
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
    
    const data: { message: string, data: { id: string, name: string} | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect data format in the postgresDB.addAgent(). Expected non-empty '{}`);
    }

    return data.data as { id: string, name: string };
  } catch (error) {
    throw new Error(`Failed to add agent (PostgresDB): ${error}`);
  }
};

export default addAgent;