import { memo } from 'react';
import { Link } from 'react-router-dom';
import AddWorkspaceDialog from './AddWorkspaceDialog';
import Button from 'src/components/button';
import Tooltip from 'src/components/tooltip';
import styles from './WorkspacesMenu.module.css';
import { Workspace } from 'src/types';

interface Props {
  userId: string;
  currentWorkspaceName: string;
  workspaces: Workspace[];
}

const WorkspacesMenu = memo(({ userId, currentWorkspaceName, workspaces }: Props) => {
  return (
    <div className={styles.container}>
      {workspaces.map(w => (
        <Tooltip.Root key={w.id}>
          <Tooltip.Trigger asChild>
            <Link prefetch='intent' to={`/${w.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${currentWorkspaceName === w.name ?  styles.button: ''}`}
              >
                {w.name[0].toUpperCase()}
              </Button>
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Content side='right' sideOffset={12}>
            {w.name}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
      <AddWorkspaceDialog userId={userId} />
    </div>
  );
});

export default WorkspacesMenu;