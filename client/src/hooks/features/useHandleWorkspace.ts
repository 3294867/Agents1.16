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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        if (!userId || !workspaceName) {
          setError('Missing required fields: workspaceName');
          return;
        }
        setIsLoading(true);

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
          setIsLoading(false);
          return;
        }

        setWorkspaces(getWorkspacesIDB);
        setIsLoading(false);
      } catch (error) {
        throw new Error(`Failed to set workspaces: ${error}`);
      }
    };
    getWorkspaces();
    
    navigate(`/${workspaceName}/general`);
  },[userId, workspaceName]);

  return { workspaces, error, isLoading };
};

export default useHandleWorkspace;