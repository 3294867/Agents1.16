import { Agent } from 'src/types';

const getAgents = async (userId: string): Promise<Agent[] | null> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: Agent[] | null } = await response.json();
  if (data.data === null) throw new Error(data.message);
  return data.data;
};

export default getAgents;