import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  userId: string;
}

const useHandleRedirect = ({ userId }: Props): void => {
  const navigate = useNavigate();
  const { agentName } = useParams();

  useEffect(() => {
    if (!agentName) return;

    try {
      const redirect = async () => {
        let agent = await indexedDB.getAgentByName({ userId, agentName });
        if (!agent) agent = await postgresDB.getAgentByName({ userId, agentName });
  
        const savedTabs = tabsStorage.load(agentName);
        if (!savedTabs || savedTabs.length === 0) {
          const id = uuidV4();
          const addedThread = await postgresDB.addThread({
            id,
            userId,
            agentId: agent.id,
          });
          if (!addedThread) return;
          await indexedDB.addThread({ thread: addedThread }).then(() => {
            const tab = {
              id: addedThread.id,
              agentId: addedThread.agentId,
              title: addedThread.title,
              isActive: true
            };
            tabsStorage.addTab(agentName, tab);
            navigate(`/${agentName}/${id}`);
          });
        } else {
          navigate(`/${agentName}/${savedTabs[0].id}`, { replace: true });
        }
      };
      redirect();
    } catch (error) {
      throw new Error(`Failed to redirect: ${error}`);
    }
  },[agentName, userId]);
};

export default useHandleRedirect;