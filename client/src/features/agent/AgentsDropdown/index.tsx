import { memo } from 'react';
import { Link } from 'react-router-dom';
import hooks from 'src/hooks';
import utils from 'src/utils';
import Button from 'src/components/button';
import AddAgentDialog from './addAgentDialog';
import Dropdown from 'src/components/dropdown';
import Error from 'src/components/error';
import Icons from 'src/assets/icons';
import styles from './AgentsDropdown.module.css';

const AgentsDropdown = memo(() => {
  const { workspaceId, workspaceName, agentName } = hooks.features.useAgentContext();
  const { agentNames, error, isLoading } = hooks.features.useHandleAgentsDropdown({ workspaceId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!agentNames) return <Error error='Something went wrong. Try again later.' />;

  const filteredAgentNames = agentNames.filter((i: string) => i !== agentName);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant='outline' style={{ borderRadius: '9999px' }}>
          {utils.capitalizeFirstLetter(agentName)}
          <Icons.ChevronDown style={{ marginLeft: '0.5rem', marginRight: '-0.5rem' }} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content sideOffset={16}>
        {filteredAgentNames.map((i: string) => (
          <Link key={i} prefetch='intent' to={`/${workspaceName}/${i}`}> 
            <Button variant='dropdown' style={{ width: '100%', backgroundColor: i === agentName ? 'var(--background-dropdown-button-hover)' : '' }}>
              {utils.capitalizeFirstLetter(i)}
            </Button>
          </Link>
        ))}
        {filteredAgentNames.length > 0 && <div className={styles.separator} />}
        <AddAgentDialog />
      </Dropdown.Content>
    </Dropdown.Root>
  );
});

export default AgentsDropdown;

const Loading = () => {
  return (
    <Button variant='dropdown'>
      <Icons.Loader className={styles.loader} />
    </Button>
  );
};