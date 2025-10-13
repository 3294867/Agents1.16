import { memo } from 'react';
import { Link } from 'react-router-dom';
import hooks from 'src/hooks';
import Button from 'src/components/button';
import HoverCard from 'src/components/hover-card';
import WorkspaceMembersDialog from './WorkspaceMembersDialog';
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
        <HoverCard.Root key={i.id}>
          <HoverCard.Trigger asChild>
            <Link prefetch='intent' to={`/${i.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${currentWorkspaceName === i.name ?  styles.button: ''}`}
              >
                {i.name[0].toUpperCase()}
              </Button>
            </Link>
          </HoverCard.Trigger>
          <HoverCard.Content align='start' side='right' sideOffset={12}>
            <Paragraph style={{ marginTop: '0.25rem', marginLeft: '0.75rem'}}>
              {i.name[0].toUpperCase() + i.name.slice(1, i.name.length)}
            </Paragraph>
            <div className={styles.separator} />
            <WorkspaceMembersDialog
              workspaceId={i.id}
              workspaceName={currentWorkspaceName}
              userRole={i.userRole}
            />
          </HoverCard.Content>
        </HoverCard.Root>
      ))}
      <AddWorkspaceDialog userId={userId} />
    </div>
  );
});
WorkspacesMenu.displayName = 'WorkspacesMenu';

export default WorkspacesMenu;
