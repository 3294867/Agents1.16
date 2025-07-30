import Agents from './Agents';
import ThemeToggle from 'src/features/layout/sidebar/ThemeToggle';
import Account from './Account';
import { Agent } from 'src/types';
import styles from './Sidebar.module.css';

interface Props {
  userId: string;
  agents: Agent[];
  isMobile: boolean;
}

const Sidebar = ({ userId, agents, isMobile }: Props) => {
  return !isMobile && (
    <aside className={styles.sidebar}>
      <Agents userId={userId} agents={agents} />
      <div className={styles.bottomSection}>
        <ThemeToggle />
        <Account userId={userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
