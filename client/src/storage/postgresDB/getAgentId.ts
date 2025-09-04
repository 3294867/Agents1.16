interface Props {
  userId: string;
  workspaceName: string;
  agentName: string;
}

const getAgentId = async ({ userId, workspaceName, agentName }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-agent-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, workspaceName, agentName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agentId (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data as string;
  } catch (error) {
    throw new Error(`Failed to fetch agentId (PostgresDB): ${error}`);
  }
};

export default getAgentId;