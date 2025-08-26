import { Team } from 'src/types';

interface Props {
  userId: string;
  teamName: string;
}

const getTeamByName = async ({ userId, teamName }: Props): Promise<Team> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-team-by-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, teamName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch team (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string, data: Team | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    return data.data as Team;
    
  } catch (error) {
    throw new Error(`Failed to fetch team (PostgresDB): ${error}`);
  }
};

export default getTeamByName;