import Teams from './teams';
import Agents from './agents';
import ThemeToggle from 'src/features/layout/sidebar/ThemeToggle';
import NotificationsPopover from './NotificationsPopover';
import Account from './Account';
import { Agent, Team } from 'src/types';
import styles from './Sidebar.module.css';

interface Props {
  userId: string;
  teams: Team[];
  agents: Agent[];
  isMobile: boolean;
}

const Sidebar = ({ userId, teams, agents, isMobile }: Props) => {
  return !isMobile && (
    <aside className={styles.container}>
      <div className={styles.topSection}>
        <Teams userId={userId} teams={teams} />
        <Agents userId={userId} agents={agents} />
      </div>
      <div className={styles.bottomSection}>
        <ThemeToggle />
        <NotificationsPopover userId={userId} />
        <Account userId={userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
