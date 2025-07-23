interface Props {
  threadId: string;
  requestBody: string;
  responseBody: string;
};

/** Adds query to the thread body (PostgresDB). */
const addQuery = async ({ threadId, requestBody, responseBody }: Props): Promise<{ requestId: string, responseId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/add-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, requestBody, responseBody })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update thread body (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: { requestId: string, responseId: string } | null } = await response.json();
    if (data.data === null) throw new Error(data.message);
    return data.data;

  } catch (error) {
    throw new Error(`Failed to update thread body (PostgresDB): ${error}`);
  }
};

export default addQuery;