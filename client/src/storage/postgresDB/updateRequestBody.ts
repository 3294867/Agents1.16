interface Props {
  requestId: string;
  requestBody: string;
}

const updateRequestBody = async ({ requestId, requestBody }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/update-request-body`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, requestBody })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update request body (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: null } = await response.json();
    if (data.message !== 'Request body updated') throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to update request body (PostgresDB): ${error}`);
  }
};

export default updateRequestBody;