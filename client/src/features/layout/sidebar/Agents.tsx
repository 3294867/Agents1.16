import { Link, useParams } from 'react-router-dom';
import Button from 'src/components/Button';
import Tooltip from 'src/components/Tooltip';
import styles from './Agents.module.css';
import { Agent } from 'src/types';
import Icons from 'src/assets/Icons';

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
            {a.name}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
      <Button variant='outline' size='icon'>
        <Icons.Add />
      </Button>
    </div>
  );
};

export default Agents;
