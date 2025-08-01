interface Props {
  threadId: string;
};

/** Updates request body on edited question (PostgresDB) */
const getThreadUpdatedAt = async ({ threadId }: Props): Promise<Date> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/get-thread-updated-at`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get 'updatedAt' property of the thread (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Date } = await response.json();
    if (!data.data) throw new Error(data.message);

    return data.data
  } catch (error) {
    throw new Error(`Failed to get 'updatedAt' property of the thread (PostgresDB): ${error}`);
  }
};

export default getThreadUpdatedAt;