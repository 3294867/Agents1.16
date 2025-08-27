  import { useEffect, useState } from 'react';
  import indexedDB from 'src/storage/indexedDB';
  import postgresDB from 'src/storage/postgresDB';
  import { Team } from 'src/types';

  interface Props {
    userId: string;
  }

  const useHandleTeams = ({ userId }: Props): { teams: Team[] | null, error: string | null, isLoading: boolean} => {
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect(() => {
      const getTeams = async () => {
        try {
          if (!userId) {
            setError('User id is required');
            return;
          }
          setIsLoading(true);
          setError(null);

          const getTeamsIDB = await indexedDB.getTeams({ userId });

          const teamsIDBUpdatedAt: { id: string, updatedAt: Date}[] = [];
          for (const teamIDB of getTeamsIDB) {
            teamsIDBUpdatedAt.push({
              id: teamIDB.id,
              updatedAt: teamIDB.updatedAt
            });
          }

          const getTeamsPGDBUpdatedAt = await postgresDB.getTeamsUpdatedAt({ userId });

          if (getTeamsIDB.length === 0 || JSON.stringify(teamsIDBUpdatedAt) !== JSON.stringify(getTeamsPGDBUpdatedAt)) {
            const getTeamsPGDB = await postgresDB.getTeams({ userId });
            await indexedDB.addTeams({ teams: getTeamsPGDB });
            setTeams(getTeamsPGDB);
            setIsLoading(false);
            return;
          }

          setTeams(getTeamsIDB);
          setIsLoading(false);
        } catch (error) {
          throw new Error(`Failed to fetch teams: ${error}`);
        }
      };
      getTeams();
    },[userId]);

    return { teams, error, isLoading };
  };

  export default useHandleTeams;