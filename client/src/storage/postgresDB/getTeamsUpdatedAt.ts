interface Props {
  userId: string;
}

/** Fetches 'id' and 'updatedAt' properties for each agent (PostgresDB) */
const getTeamsUpdatedAt = async ({ userId }: Props): Promise<{ id: string, updatedAt: Date }[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-teams-updated-at`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get 'updatedAt' property for each team (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: { id: string, updatedAt: Date }[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as { id: string, updatedAt: Date }[];

  } catch (error) {
    throw new Error(`Failed to get 'updatedAt' property for each team (PostgresDB): ${error}`);
  }
};

export default getTeamsUpdatedAt;