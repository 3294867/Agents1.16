import Icons from 'src/assets/Icons';
import { Button } from 'src/components/Button';
import { Dropdown, DropdownContent, DropdownTrigger } from 'src/components/Dropdown';
import styles from './Actions.module.css'

interface Props {
  userId: string;
  agentId: string;
}

const Actions = ({ userId, agentId }: Props) => {
  return (
    <div className={styles.container}>
      <Button variant='outline' size='icon' style={{ width: '2rem', height: '2rem' }}>
        <Icons.History />
      </Button>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant='outline' size='icon' style={{ width: '2rem', height: '2rem' }}>
            <Icons.More />
          </Button>
        </DropdownTrigger>
        <DropdownContent align='end' sideOffset={12}>
          <Button variant='dropdown'>
            <Icons.Library style={{ marginRight: '0.5rem' }} />
            Library
          </Button>
          <Button variant='dropdown'>
            <Icons.Settings style={{ marginRight: '0.5rem' }} />
            Settings
          </Button>
        </DropdownContent>
      </Dropdown>
    </div>    
  );
};

export default Actions;