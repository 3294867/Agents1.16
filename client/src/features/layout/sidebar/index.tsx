import Teams from './teams';
import ThemeToggle from 'src/features/layout/sidebar/ThemeToggle';
import NotificationsPopover from './NotificationsPopover';
import Account from './Account';
import { Team } from 'src/types';
import styles from './Sidebar.module.css';

interface Props {
  userId: string;
  teams: Team[];
  isMobile: boolean;
}

const Sidebar = ({ userId, teams, isMobile }: Props) => {
  return !isMobile && (
    <aside className={styles.container}>
      <Teams userId={userId} teams={teams} />
      <div className={styles.bottomSection}>
        <ThemeToggle />
        <NotificationsPopover userId={userId} />
        <Account userId={userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
