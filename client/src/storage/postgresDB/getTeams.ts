import { Team } from 'src/types';

interface Props {
  userId: string;
}

const getTeams = async ({ userId }: Props): Promise<Team[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch teams (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Team[] | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as Team[];
    
  } catch (error) {
    throw new Error(`Failed to fetch teams (PostgresDB): ${error}`);
  }
};

export default getTeams;