interface Props {
  responseId: string;
  responseBody: string;
}

/** Updates response body on edited question (PostgresDB) */
const updateResponseBody = async ({ responseId, responseBody }: Props): Promise<string> => {
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
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as string;

  } catch (error) {
    throw new Error(`Failed to update response body (PostgresDB): ${error}`);
  }
};

export default updateResponseBody;