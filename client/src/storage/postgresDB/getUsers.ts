interface Props {
  input: string;
}

const getUsers = async ({ input }: Props): Promise<string[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: string[] } = await response.json();
    if (!data.data) throw new Error(data.message);

    return data.data as string[];
  } catch (error) {
    throw new Error(`Failed to fetch users (PostgresDB): ${error}`);
  }
};

export default getUsers;