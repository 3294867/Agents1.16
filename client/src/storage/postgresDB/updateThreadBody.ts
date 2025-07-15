interface Request {
  threadId: string;
  requestBody: string;
  responseBody: string;
};

/**
 * Update thread body.
 * 
 * @param {string} props.threadId - Thread id.
 * @param {string} props.requestBody - Request body.
 * @param {string} props.responseBody - Response body.
 * @returns {string} Response id.
*/
const updateThreadBody = async (props: Request): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/update-thread-body`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: props.threadId,
      requestBody: props.requestBody,
      responseBody: props.responseBody
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update thread body: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: string | null } = await response.json();
  if (data.data === null) throw new Error(data.message);
  return data.data;
};

export default updateThreadBody;