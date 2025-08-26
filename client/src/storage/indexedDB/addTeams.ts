import { db } from 'src/storage/indexedDB';
import { Team } from 'src/types';

interface Props {
  teams: Team[];
}

const addTeams = async ({ teams }: Props): Promise<void> => {
  try {
    await db.teams.bulkPut(teams);
  } catch (error) {
    console.error('Failed to add teams (IndexedDB): ', error);
  }
};

export default addTeams;