interface Props {
  threadId: string;
}

const getThreadUpdatedAt = async ({ threadId }: Props): Promise<Date> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-thread-updated-at`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get 'updatedAt' property of the thread (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Date | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data as Date;
  } catch (error) {
    throw new Error(`Failed to get 'updatedAt' property of the thread (PostgresDB): ${error}`);
  }
};

export default getThreadUpdatedAt;