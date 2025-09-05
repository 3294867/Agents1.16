import { memo } from 'react';
import hooks from 'src/hooks';
import WorkspacesMenu from './workspaces-menu';
import ThemeToggle from 'src/features/workspace/sidebar/ThemeToggle';
import NotificationsPopover from './NotificationsPopover';
import Account from './Account';
import styles from './Sidebar.module.css';

const Sidebar = memo(() => {
  const { isMobile } = hooks.features.useWorkspaceContext();

  return !isMobile && (
    <aside className={styles.container}>
      <WorkspacesMenu />
      <div className={styles.bottomSection}>
        <ThemeToggle />
        <NotificationsPopover />
        <Account />
      </div>
    </aside>
  );
});

export default Sidebar;
