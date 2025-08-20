import { Link, useParams } from 'react-router-dom';
import Button from 'src/components/button';
import Tooltip from 'src/components/tooltip';
import AddAgentDialog from './agents/addAgentDialog';
import { Agent } from 'src/types';
import styles from './Agents.module.css';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';

interface Props {
  userId: string;
  agents: Agent[];
}

const Agents = ({ userId, agents }: Props) => {
  const { agentName } = useParams();
  
  return (
    <div className={styles.agentsContainer}>
      {agents.map(a => (
        <Tooltip.Root key={a.name}>
          <Tooltip.Trigger asChild>
            <Link prefetch='intent' to={`/${a.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${agentName === a.name ?  styles.agentButton: ''}`}
              >
                {a.name[0].toUpperCase()}
              </Button>
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Content side='right' sideOffset={12}>
            {capitalizeFirstLetter(a.name)}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
      <AddAgentDialog userId={userId} addedAgents={agents} />
    </div>
  );
};

export default Agents;
