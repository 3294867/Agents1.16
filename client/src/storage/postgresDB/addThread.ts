interface Props {
  agentId: string;
}

const addThread = async ({ agentId }: Props): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add thread: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: string | null } = await response.json();
  if (!data.data) throw new Error('Failed to add thread');
  return data.data as string;
};

export default addThread;