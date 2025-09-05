import hooks from 'src/hooks';
import Icons from 'src/assets/icons';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown';
import styles from './Actions.module.css'

const Actions = () => {
  const { userId, agentId } = hooks.features.useAgentContext();
  
  return (
    <div className={styles.container}>
      <Button variant='outline' size='icon'>
        <Icons.History />
      </Button>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant='outline' size='icon'>
            <Icons.More />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content align='end' sideOffset={12}>
          <Button variant='dropdown'>
            <Icons.Library style={{ marginRight: '0.5rem' }} />
            Library
          </Button>
          <Button variant='dropdown'>
            <Icons.Settings style={{ marginRight: '0.5rem' }} />
            Settings
          </Button>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>    
  );
};

export default Actions;