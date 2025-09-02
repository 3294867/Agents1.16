import { memo } from 'react';
import { Link } from 'react-router-dom';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import Button from 'src/components/button';
import AddAgentDialog from './addAgentDialog';
import Dropdown from 'src/components/dropdown';
import Error from 'src/components/error';
import Icons from 'src/assets/icons';
import hooks from 'src/hooks';
import styles from './AgentsDropdown.module.css';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentName: string;
}

const AgentsDropdown = memo(({ workspaceId, workspaceName, agentName }: Props) => {
  const { agentNames, error, isLoading } = hooks.features.useHandleAgentsDropdown({ workspaceId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!agentNames) return <Error error='Something went wrong. Try again later.' />;

  const filteredAgentNames = agentNames.filter((i: string) => i !== agentName);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant='outline' style={{ borderRadius: '9999px' }}>
          {capitalizeFirstLetter(agentName)}
          <Icons.ChevronDown style={{ marginLeft: '0.5rem', marginRight: '-0.5rem' }} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content sideOffset={16}>
        {filteredAgentNames.map((i: string) => (
          <Link key={i} prefetch='intent' to={`/${workspaceName}/${i}`}> 
            <Button variant='dropdown' style={{ width: '100%', backgroundColor: i === agentName ? 'var(--background-dropdown-button-hover)' : '' }}>
              {capitalizeFirstLetter(i)}
            </Button>
          </Link>
        ))}
        {filteredAgentNames.length > 0 && <div className={styles.separator} />}
        <AddAgentDialog workspaceId={workspaceId} workspaceName={workspaceName} />
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