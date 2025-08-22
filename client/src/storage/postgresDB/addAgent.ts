import { Agent } from 'src/types';

interface Props {
  agent: Agent;
}

const addAgent = async ({ agent }: Props): Promise<Agent> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Agent | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as Agent;
    
  } catch (error) {
    throw new Error(`Failed to add agent (PostgresDB): ${error}`);
  }
};

export default addAgent;