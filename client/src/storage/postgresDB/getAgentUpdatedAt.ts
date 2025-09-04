interface Props {
  agentId: string;
}

const getAgentUpdatedAt = async ({ agentId }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-agent-updated-at`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get 'updatedAt' property of the agent (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data as string;
  } catch (error) {
    throw new Error(`Failed to get 'updatedAt' property of the agent (PostgresDB): ${error}`);
  }
};

export default getAgentUpdatedAt;