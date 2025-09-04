interface Props {
  workspaceId: string;
}

const getAgentNames = async ({ workspaceId }: Props): Promise<string[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-agent-names`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch agent names (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (!Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Incorrect data format in the postgresDB.getAgentNames(). Expected non-empty '[]`);
    }
    
    return data.data as string[];
  } catch (error) {
    throw new Error(`Failed to fetch agents data (PostgresDB): ${error}`);
  }
};

export default getAgentNames;