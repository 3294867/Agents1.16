interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
};

/** Deletes query from the thread body (PostgresDB) */
const deleteQuery = async ({ threadId, requestId, responseId }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/delete-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, requestId, responseId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete query (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string } = await response.json();
    if (data.message !== 'Query deleted.') throw new Error(data.message);

  } catch (error) {
    throw new Error(`Failed to delete query (PostgresDB): ${error}`);
  }
};

export default deleteQuery;