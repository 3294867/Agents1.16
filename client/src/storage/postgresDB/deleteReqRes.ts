interface Props {
  threadId: string;
  requestId: string;
  responseId: string;
}

const deleteReqRes = async ({ threadId, requestId, responseId }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/delete-reqres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, requestId, responseId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete reqres (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: null } = await response.json();
    if (data.message !== 'Reqres deleted') throw new Error(data.message);
  } catch (error) {
    throw new Error(`Failed to delete reqres (PostgresDB): ${error}`);
  }
};

export default deleteReqRes;