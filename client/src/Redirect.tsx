import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import tabsStorage from './utils/localStorage/tabsStorage';
import { createThread } from './actions/createThread';
import getAgent from './utils/indexedDB/getAgent';

interface RedirectProps {
  userId: string;
};

const Redirect = (props: RedirectProps) => {
  const navigate = useNavigate();
  const { agentName } = useParams<{ agentName: string }>();
  
  useEffect(() => {
    if (!agentName) return;
    const redirect = async () => {
      const gettingAgent = async () => {
        const agent = await getAgent(agentName);
        if (agent) return agent.id;
      };
      const agentId = await gettingAgent();
      if (!agentId) return;

      const savedTabs = tabsStorage.load(agentName);
      if (savedTabs === null) {
        const id = uuidV4();
        createThread(id, props.userId, agentId, agentName)
          .then(() => navigate(`/${agentName}/${id}`));
      } else {
        navigate(`/${agentName}/${savedTabs[0].id}`, { replace: true });
      }
    };
    redirect();
    
  },[agentName, props.userId, navigate])
  return null;
};

export default Redirect;
 