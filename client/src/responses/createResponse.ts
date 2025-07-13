interface RequestBody {
  threadId: string;
  model: 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-audio-preview' | 'chatgpt-4o',
  body: string;
};

/**
 * Create response.
 * 
 * @param {string} props.threadId - Thread id.
 * @param {string} props.model - AI model.
 * @param {string} props.body - Request input.
 * @returns {string} - Response.
*/
const createResponse = async (props: RequestBody): Promise<string | null> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: props.threadId,
      model: props.model,
      body: props.body
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get response: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: { message: string, data: string } = await response.json();
  if (data.data === null) throw new Error(data.message);
  return data.data;
};

export default createResponse;