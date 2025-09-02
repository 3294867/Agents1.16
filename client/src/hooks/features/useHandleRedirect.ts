import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  userId: string;
}

const useHandleRedirect = ({ userId }: Props): void => {
  const navigate = useNavigate();
  const { workspaceName, agentName } = useParams();

  useEffect(() => {
    if (!workspaceName) return;
    
    try {
      const redirect = async () => {
        let workspaceId:  string | undefined;
        workspaceId = await indexedDB.getWorkspaceId({ workspaceName });
        if (!workspaceId) workspaceId = await postgresDB.getWorkspaceId({ userId, workspaceName });

        /** Redirect from  /:workspaceName */
        if (!agentName) {
          navigate(`/${workspaceName}/general`);
          return;
        }
        
        /** Redirect from  /:workspaceName/:agentName */
        let agentId: string | undefined;
        agentId = await indexedDB.getAgentId({ workspaceId, agentName });
        if (!agentId) agentId = await postgresDB.getAgentId({ userId, workspaceName, agentName });
  
        const loadSavedTabs = tabsStorage.load(workspaceName, agentName);
        if (!loadSavedTabs || loadSavedTabs.length === 0) {
          const { threadId, threadCreatedAt, threadUpdatedAt } = await postgresDB.addThread({ userId, agentId });
          await indexedDB.addThread({ threadId, agentId, createdAt: threadCreatedAt, updatedAt: threadUpdatedAt }).then(() => {
            const tab = {
              id: threadId,
              workspaceId,
              agentId,
              name: 'New chat',
              isActive: true
            };
            tabsStorage.addTab(workspaceName, agentName, tab);
            navigate(`/${workspaceName}/${agentName}/${threadId}`, { replace: true });
          });
        } else {
          navigate(`/${workspaceName}/${agentName}/${loadSavedTabs[0].id}`, { replace: true });
        }
      };
      redirect();
    } catch (error) {
      throw new Error(`Failed to redirect: ${error}`);
    }
  },[userId, workspaceName, agentName]);
};

export default useHandleRedirect;