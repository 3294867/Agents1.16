import Workspaces from './workspaces';
import ThemeToggle from 'src/features/workspace/sidebar/ThemeToggle';
import NotificationsPopover from './NotificationsPopover';
import Account from './Account';
import { WorkspaceFE } from 'src/types';
import styles from './Sidebar.module.css';

interface Props {
  userId: string;
  workspaces: WorkspaceFE[];
  isMobile: boolean;
}

const Sidebar = ({ userId, workspaces, isMobile }: Props) => {
  return !isMobile && (
    <aside className={styles.container}>
      <Workspaces userId={userId} workspaces={workspaces} />
      <div className={styles.bottomSection}>
        <ThemeToggle />
        <NotificationsPopover userId={userId} />
        <Account userId={userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
