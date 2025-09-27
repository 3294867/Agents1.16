import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import { WorkspaceMember } from 'src/types';

interface Props {
  workspaceId: string;
}

interface Return {
  members: WorkspaceMember[] | null;
  isLoading: boolean;
  error: string | null;
}


const useHandleMembersTable = ({ workspaceId }: Props): Return => {
  const [members, setMembers] = useState<WorkspaceMember[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setError('Missing required fields: workspaceId');
      setIsLoading(false);
      return;
    }

    try {
      const init = async () => {
        const fetchingMembers = await postgresDB.getWorkspaceMembers({ workspaceId });
        if (!fetchingMembers) {
          setError('Failed to fetch members (PostgresDB)');
          return;
        }
        setMembers(fetchingMembers);
      };
      init();
    } catch (err) {
      setError(`Failed to fetch members: ${err}`);
    } finally {
      setIsLoading(false);
    }
    
  },[workspaceId]);

  return { members, isLoading, error };
};

export default useHandleMembersTable;