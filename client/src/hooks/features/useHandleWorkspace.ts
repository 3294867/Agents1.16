import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import { Workspace } from 'src/types';

interface Props {
  userId: string;
  workspaceName: string | undefined;
}

const useHandleWorkspace = ({ userId, workspaceName }: Props): { workspaces: Workspace[] | null, error: string | null, isLoading: boolean} => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !workspaceName) {
      setError('All props are required: userId, workspaceName');
      setIsLoading(false);
      return;
    }
    
    const init = async () => {
      try {
        const getWorkspacesIDB = await indexedDB.getWorkspaces();

        const workspacesDataIDB: { id: string, updatedAt: Date}[] = [];
        for (const item of getWorkspacesIDB) {
          workspacesDataIDB.push({
            id: item.id,
            updatedAt: item.updatedAt
          });
        }

        const getWorkspacesData = await postgresDB.getWorkspacesUpdatedAt({ userId });

        if (getWorkspacesIDB.length === 0 || JSON.stringify(workspacesDataIDB) !== JSON.stringify(getWorkspacesData)) {
          const getWorkspacesPGDB = await postgresDB.getWorkspaces({ userId });
          await indexedDB.addWorkspaces({ workspaces: getWorkspacesPGDB });
          setWorkspaces(getWorkspacesPGDB);
          return;
        }

        setWorkspaces(getWorkspacesIDB);
      } catch (error) {
        setError(`Failed to set workspaces: ${error}`);
      } finally {
        setIsLoading(false);
        navigate(`/${workspaceName}/general`);
      }
    };
    init();
  },[userId, workspaceName]);

  return { workspaces, error, isLoading };
};

export default useHandleWorkspace;