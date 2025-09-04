interface Props {
  userId: string;
  workspaceName: string;
}

const getWorkspaceId = async ({ userId, workspaceName }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-workspace-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, workspaceName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch workspaceId (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data as string;
  } catch (error) {
    throw new Error(`Failed to fetch workspaceId (PostgresDB): ${error}`);
  }
};

export default getWorkspaceId;