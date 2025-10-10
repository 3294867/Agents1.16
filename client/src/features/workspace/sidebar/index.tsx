import { memo  } from 'react';
import hooks from 'src/hooks';
import WorkspacesMenu from './workspaces-menu';
import ThemeToggle from 'src/features/workspace/sidebar/ThemeToggle';
import NotificationsPopover from './notifacations-popover';
import Account from './Account';
import styles from './Sidebar.module.css';

const Sidebar = memo(() => {
  const { isMobile } = hooks.features.useWorkspaceContext();

  return !isMobile && (
    <aside className={styles.sidebarContainer}>
      <WorkspacesMenu />
      <div className={styles.sidebarContainerBottomSection}>
        <ThemeToggle />
        <NotificationsPopover />
        <Account />
      </div>
    </aside>
  );
});
Sidebar.displayName = 'Sidebar';

export default Sidebar;
