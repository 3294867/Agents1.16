interface Props {
  workspaceId: string;
  agentId: string;
  publicThreadId: string;
}

const duplicateThread = async ({ workspaceId, agentId, publicThreadId }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/duplicate-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, publicThreadId, agentId })
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to duplicate thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
  
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data as string;
  } catch (error) {
    throw new Error(`Failed to duplicate thread (PostgresDB): ${error}`);
  }
};

export default duplicateThread;