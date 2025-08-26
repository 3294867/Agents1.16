import { db } from 'src/storage/indexedDB';
import { Team } from 'src/types';

interface Props {
  userId: string;
}

const getTeams = async ({ userId }: Props): Promise<Team[]> => {
  try {
    const gettingTeams = await db.teams.where('id').equals(userId).toArray();
    return gettingTeams;
  } catch (error) {
    throw new Error(`Failed to fetch teams (IndexedDB): ${error}`);
  }
};

export default getTeams;