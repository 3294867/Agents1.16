interface Props {
  responseId: string;
  responseBody: string;
}

const updateResponseBody = async ({ responseId, responseBody }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/update-response-body`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseId, responseBody })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update response body (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: null } = await response.json();
    if (data.message !== 'Response body updated') throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to update response body (PostgresDB): ${error}`);
  }
};

export default updateResponseBody;