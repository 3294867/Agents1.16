import { memo } from 'react';
import { Link } from 'react-router-dom';
import hooks from 'src/hooks';
import Button from 'src/components/button';
import Popover from 'src/components/popover';
import AddWorkspaceDialog from './AddWorkspaceDialog';
import Paragraph from 'src/components/paragraph';
import Icons from 'src/assets/icons';
import styles from './WorkspacesMenu.module.css';

const WorkspacesMenu = memo(() => {
  const {
    userId,
    workspaceName: currentWorkspaceName,
    workspaces
  } = hooks.features.useWorkspaceContext();

  return (
    <div className={styles.workspacesMenuContainer}>
      {workspaces.map(w => (
        <Popover.Root key={w.id}>
          <Popover.Trigger asChild>
            <Link prefetch='intent' to={`/${w.name}`}> 
              <Button
                variant='outline'
                size='icon'
                className={`${currentWorkspaceName === w.name ?  styles.button: ''}`}
              >
                {w.name[0].toUpperCase()}
              </Button>
            </Link>
          </Popover.Trigger>
          <Popover.Content align='start' side='right' sideOffset={12}>
            <Paragraph style={{ marginTop: '0.25rem', marginLeft: '0.75rem'}}>
              {w.name[0].toUpperCase() + w.name.slice(1, w.name.length)}
            </Paragraph>
            <Button
              role='menuitem'
              variant='dropdown'
              style={{ width: '100%' }}
            >
              <Icons.Users style={{ marginRight: '0.5rem' }}/>
              Members
            </Button>
          </Popover.Content>
        </Popover.Root>
      ))}
      <AddWorkspaceDialog userId={userId} />
    </div>
  );
});
WorkspacesMenu.displayName = 'WorkspacesMenu';

export default WorkspacesMenu;
