import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddWorkspaceDialog from './AddWorkspaceDialog';
import Button from 'src/components/button';
import Tooltip from 'src/components/tooltip';
import styles from './Workspaces.module.css';
import { Workspace } from 'src/types';

interface Props {
  userId: string;
  workspaces: Workspace[];
}

const WorkspacesBar = memo(({ userId, workspaces }: Props) => {
  const { workspaceName } = useParams();
  
  return (
    <div className={styles.workspacesContainer}>
      {workspaces.map(w => (
        <Tooltip.Root key={w.id}>
          <Tooltip.Trigger asChild>
            <Link prefetch='intent' to={`/${w.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${workspaceName === w.name ?  styles.teamButton: ''}`}
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

export default WorkspacesBar;