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

const useHandleWorkspaceMembersData = ({ workspaceId }: Props): Return => {
  const [members, setMembers] = useState<WorkspaceMember[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setError('Missing required fields: workspaceId');
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const fetchMembers = await postgresDB.getWorkspaceMembers({ workspaceId });
        if (!fetchMembers) {
          setError('Failed to fetch members (PostgresDB)');
          return;
        }
        setMembers(fetchMembers);
      } catch (err) {
        setError(`Failed to fetch members: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }
    init();
    
    window.addEventListener('memberRoleUpdated', init as EventListener);
    return () => window.removeEventListener('memberRoleUpdated', init as EventListener);
  },[workspaceId]);

  return { members, isLoading, error };
};

export default useHandleWorkspaceMembersData;