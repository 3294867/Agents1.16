import { memo } from 'react';
import { Link } from 'react-router-dom';
import hooks from 'src/hooks';
import Button from 'src/components/button';
import Popover from 'src/components/popover';
import ManageMembersDialog from './ManageMembersDialog';
import Paragraph from 'src/components/paragraph';
import AddWorkspaceDialog from './add-workspace-dialog';
import { Workspace } from 'src/types';
import styles from './WorkspacesMenu.module.css';

const WorkspacesMenu = memo(() => {
  const {
    userId,
    workspaceName: currentWorkspaceName,
    workspaces
  } = hooks.features.useWorkspaceContext();

  return (
    <div className={styles.workspacesMenuContainer}>
      {workspaces.map((i: Workspace) => (
        <Popover.Root key={i.id}>
          <Popover.Trigger asChild>
            <Link prefetch='intent' to={`/${i.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${currentWorkspaceName === i.name ?  styles.button: ''}`}
              >
                {i.name[0].toUpperCase()}
              </Button>
            </Link>
          </Popover.Trigger>
          <Popover.Content align='start' side='right' sideOffset={12}>
            <Paragraph style={{ marginTop: '0.25rem', marginLeft: '0.75rem'}}>
              {i.name[0].toUpperCase() + i.name.slice(1, i.name.length)}
            </Paragraph>
            <div className={styles.separator} />
            <ManageMembersDialog
              workspaceId={i.id}
              userRole={i.userRole}
            />
          </Popover.Content>
        </Popover.Root>
      ))}
      <AddWorkspaceDialog userId={userId} />
    </div>
  );
});
WorkspacesMenu.displayName = 'WorkspacesMenu';

export default WorkspacesMenu;
