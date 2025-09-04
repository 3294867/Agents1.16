interface Props {
  threadId: string;
}

const deleteThread = async ({ threadId }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/delete-thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete thread: ${response.status} ${response.statusText} - ${errorText}`);
    }
  
    const data: { message: string, data: null } = await response.json();
    if (data.message !== 'Thread deleted') throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to delete thread (PostgresDB): ${error}`);
  }
};

export default deleteThread;