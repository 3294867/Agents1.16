interface Props {
  threadId: string;
  requestBody: string;
  responseBody: string;
  responseType: string;
}

const addReqRes = async ({ threadId, requestBody, responseBody, responseType }: Props): Promise<{ requestId: string, responseId: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-reqres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, requestBody, responseBody, responseType })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add reqres (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: { requestId: string, responseId: string } | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if (Object.keys(data.data).length === 0) {
      throw new Error(`Incorrect data format in the postgresDB.addReqres(). Expected non-empy '{}`);
    }
    
    return data.data as { requestId: string, responseId: string };
  } catch (error) {
    throw new Error(`Failed to add reqres (PostgresDB): ${error}`);
  }
};

export default addReqRes;