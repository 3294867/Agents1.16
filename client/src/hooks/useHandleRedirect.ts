import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  userId: string;
};

/** Handles redirecting user from '/:agentName' segment */
const useHandleRedirect = ({ userId }: Props): void => {
  const navigate = useNavigate();
  const { agentName } = useParams();
  
  useEffect(() => {
    if (!agentName) return;

    try {
      const redirect = async () => {
        let agent = await indexedDB.getAgent({
          userId,
          agentName
        });
        if (!agent) {
          agent = await postgresDB.getAgent({
            userId,
            agentName
          })
        }
  
        const savedTabs = tabsStorage.load(agentName);
        if (!savedTabs) {
          const id = uuidV4();
          const createdThread = await postgresDB.createThread({
            id,
            userId,
            agentId: agent.id,
          })
          if (!createdThread) return;
          await indexedDB.addThread({ thread: createdThread }).then(() => {
            const tab = {
              id: createdThread.id,
              agentId: createdThread.agentId,
              title: createdThread.title,
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