import { db } from 'src/storage/indexedDB';
import { Team } from 'src/types';

interface Props {
  userId: string;
  teamName: string | undefined;
}

const getTeamByName = async ({ userId, teamName }: Props): Promise<Team | undefined> => {
  if (!userId || !teamName) throw new Error('All props are required: userId, teamName');

  try {
    const team = await db.teams.where('name').equals(teamName)
      .and(team => team.userIds.includes(userId)).first();
    return team;
  } catch (error) {
    throw new Error (`Failed to fetch team (IndexedDB): ${error instanceof Error ? error.name : 'Unknown error'}`);
  }
};

export default getTeamByName;