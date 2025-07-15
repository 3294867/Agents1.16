import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import tabsStorage from '../storage/localStorage/tabsStorage';
import createThread from '../actions/createThread';
import { Agent } from 'src/types';
import postgresDB from 'src/storage/postgresDB';
import { db } from 'src/storage/indexedDB';

interface RedirectProps {
  userId: string;
};

const Redirect = (props: RedirectProps) => {
  const navigate = useNavigate();
  const { agentName } = useParams<{ agentName: string }>();
  
  useEffect(() => {
    if (!agentName) return;
    const redirect = async () => {
      let agent: Agent | null = null;
      const gettingAgent = await db.agents.where('name').equals(agentName).first();
      if (typeof gettingAgent !== 'undefined') {
        agent = gettingAgent;
      } else {
        const agents = await postgresDB.getAgents({
          userId: props.userId
        });
        if (agents) {
          agent = agents.find((a) => a.name === agentName) ?? null;
        }
      }
      if (!agent) return;
      const savedTabs = tabsStorage.load(agentName);
      if (savedTabs === null) {
        const id = uuidV4();
        createThread(id, props.userId, agent.id, agentName)
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
 