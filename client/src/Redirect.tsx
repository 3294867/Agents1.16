import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import tabsStorage from './utils/localStorage/tabsStorage';
import { useCreateThreadMutation } from './redux/actions/createThread';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import selectAgentId from './redux/selectors/selectAgentId';

interface RedirectProps {
  userId: string;
};

const Redirect = (props: RedirectProps) => {
  const navigate = useNavigate();
  const { agent } = useParams();
  const [ createThread ] = useCreateThreadMutation();
  const { agentId } = useSelector((state: RootState) => agent
    ? selectAgentId(state, agent)
    : { agentId: null });
  
  useEffect(() => {
    if (!agent || !agentId) return;

    const savedTabs = tabsStorage.load(agent)
    if (savedTabs === null) {
      const id = uuidV4();
      createThread({ id, userId: props.userId, agentId, agent })
        .then(() => navigate(`/${agent}/${id}`));
    } else {
      navigate(`/${agent}/${savedTabs[0].id}`);
    }
  },[agent, agentId, props.userId, navigate, createThread])
  return null;
};

export default Redirect;
