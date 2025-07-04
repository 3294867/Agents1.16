import Agents from './Agents';
import ThemeToggle from 'src/features/layout/sidebar/ThemeToggle';
import Account from './Account';
import { Agent } from 'src/types';

interface SidebarProps {
  userId: string;
  isMobile: boolean;
}

const Sidebar = (props: SidebarProps) => {
  const agents = localStorage.getItem('agents');
  let parsedAgents: Agent[] = [];
  if (agents) parsedAgents = JSON.parse(agents);
  
  return !props.isMobile && (
    <aside className='fixed h-screen flex flex-col justify-between p-2 pt-4 border-r-[1px] border-border'>
      <Agents userId={props.userId} agents={parsedAgents} />
      <div className='flex flex-col gap-2'>
        <ThemeToggle />
        <Account userId={props.userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
