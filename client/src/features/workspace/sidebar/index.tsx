import { memo } from 'react';
import WorkspacesMenu from './workspaces-menu';
import ThemeToggle from 'src/features/workspace/sidebar/ThemeToggle';
import NotificationsPopover from './NotificationsPopover';
import Account from './Account';
import { Workspace } from 'src/types';
import styles from './Sidebar.module.css';

interface Props {
  userId: string;
  currentWorkspaceName: string;
  workspaces: Workspace[];
  isMobile: boolean;
}

const Sidebar = memo(({ userId, currentWorkspaceName, workspaces, isMobile }: Props) => {
  return !isMobile && (
    <aside className={styles.container}>
      <WorkspacesMenu
        userId={userId}
        currentWorkspaceName={currentWorkspaceName}
        workspaces={workspaces}
      />
      <div className={styles.bottomSection}>
        <ThemeToggle />
        <NotificationsPopover userId={userId} />
        <Account userId={userId} />
      </div>
    </aside>
  );
});

export default Sidebar;
