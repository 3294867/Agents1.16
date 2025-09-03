interface Props {
  agentId: string;
}

const addThread = async ({ agentId }: Props): Promise<{ id: string, createdAt: Date, updatedAt: Date }> => {
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
  return data.data as { id: string, createdAt: Date, updatedAt: Date };
};

export default addThread;