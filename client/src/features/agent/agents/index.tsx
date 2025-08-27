import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import Button from 'src/components/button';
import AddAgentDialog from './addAgentDialog';
import Dropdown from 'src/components/dropdown';
import Error from 'src/components/error';
import Icons from 'src/assets/icons';
import { Agent, Team } from 'src/types';
import styles from './Agents.module.css';

interface Props {
  userId: string;
  team: Team;
  agents: Agent[];
}

const Agents = memo(({ userId, team, agents }: Props) => {
  const { agentName } = useParams();
  if (!agentName) return <Error error='All params are required: teamName, agentName' />;

  const filteredAgents = agents.filter(a => a.name !== agentName);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant='outline' style={{ borderRadius: '9999px' }}>
          {capitalizeFirstLetter(agentName)}
          <Icons.ChevronDown style={{ marginLeft: '0.5rem', marginRight: '-0.5rem' }} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content sideOffset={16}>
        {filteredAgents.map((a: Agent) => (
          <Link key={a.name} prefetch='intent' to={`/${team.name}/${a.name}`}> 
            <Button style={{ width: '100%', backgroundColor: a.name === agentName ? 'var(--background-dropdown-button-hover)' : '' }} variant='dropdown'>
              {capitalizeFirstLetter(a.name)}
            </Button>
          </Link>
        ))}
        {filteredAgents.length > 0 && <div className={styles.separator} />}
        <AddAgentDialog userId={userId} team={team} addedAgents={agents} />
      </Dropdown.Content>
    </Dropdown.Root>
  );
});

export default Agents;
