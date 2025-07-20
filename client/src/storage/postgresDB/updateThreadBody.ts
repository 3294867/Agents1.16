interface Props {
  threadId: string;
  requestBody: string;
  responseBody: string;
};

/**
 * Updates thread body (PostgresDB).
 * @param {string} props.threadId - Thread id.
 * @param {string} props.requestBody - Request body.
 * @param {string} props.responseBody - Response body.
 * @returns {Promise<{ requestId: string, responseId: string }>} Returns ids of the response and request.
*/
const updateThreadBody = async ({ threadId, requestBody, responseBody }: Props): Promise<{ requestId: string, responseId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/update-thread-body`, {
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

export default updateThreadBody;