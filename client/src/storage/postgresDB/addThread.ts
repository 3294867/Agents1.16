interface Props {
  agentId: string;
}

const addThread = async ({ agentId }: Props): Promise<{ id: string, createdAt: Date, updatedAt: Date }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: { id: string, createdAt: Date, updatedAt: Date } | null } = await response.json();
    if (!data.data) throw new Error('Failed to add thread');
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect format of the thread. Expected non-empty '{}'`);
    }
    
    return data.data as { id: string, createdAt: Date, updatedAt: Date };
  } catch (error) {
    throw new Error(`Failed to add thread (PostgresDB): ${error}`);
  }
};

export default addThread;