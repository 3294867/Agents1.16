interface Props {
  threadId: string;
}

const addPublicThread = async ({ threadId }: Props): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-public-thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error (`Failed to add public thread: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: { message: string, data: string | null } = await response.json();
  if (!data.data) throw new Error('Failed to add public thread');
  return data.data as string;
};

export default addPublicThread;