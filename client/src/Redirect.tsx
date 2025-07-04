import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import tabsStorage from './utils/localStorage/tabsStorage';
import agentsStorage from './utils/localStorage/agentsStorage';
import { createThread } from './actions/createThread';

interface RedirectProps {
  userId: string;
};

const Redirect = (props: RedirectProps) => {
  const navigate = useNavigate();
  const { agent } = useParams<{ agent: string }>();
  
  useEffect(() => {
    if (!agent) return;
    const savedAgentId = agentsStorage.loadAgentId(agent);
    if (!savedAgentId) return;
    
    const savedTabs = tabsStorage.load(agent)
    if (savedTabs === null) {
      const id = uuidV4();
      createThread(id, props.userId, savedAgentId, agent)
        .then(() => navigate(`/${agent}/${id}`));
    } else {
      navigate(`/${agent}/${savedTabs[0].id}`, { replace: true });
    }
  },[agent, props.userId, navigate])
  return null;
};

export default Redirect;
