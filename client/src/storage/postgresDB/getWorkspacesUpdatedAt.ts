interface Props {
  userId: string;
}

const getWorkspacesUpdatedAt = async ({ userId }: Props): Promise<{ id: string, updatedAt: Date }[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-workspaces-updated-at`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get workspaces data (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: { id: string, updatedAt: Date }[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    if(!Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Incorrect data format in the postgresDB.getWorkspacesUpdatedAt(). Expected non-empty '[]`);
    }
    
    return data.data as { id: string, updatedAt: Date }[];
  } catch (error) {
    throw new Error(`Failed to get workspaces data (PostgresDB): ${error}`);
  }
};

export default getWorkspacesUpdatedAt;