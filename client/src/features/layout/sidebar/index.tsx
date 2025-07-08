import Agents from './Agents';
import ThemeToggle from 'src/features/layout/sidebar/ThemeToggle';
import Account from './Account';
import { Agent } from 'src/types';
import getAgents from 'src/utils/indexedDB/getAgents';
import { useEffect, useState } from 'react';

interface SidebarProps {
  userId: string;
  isMobile: boolean;
}

const Sidebar = (props: SidebarProps) => {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  
  useEffect(() => {
    const gettingAgents = async () => {
      const agents = await getAgents();
      if (agents) setAgents(agents);
    };
    gettingAgents();
  },[getAgents])
  
  if (!agents) return null;
  
  return !props.isMobile && (
    <aside className='fixed h-screen flex flex-col justify-between p-2 pt-4 border-r-[1px] border-border'>
      <Agents userId={props.userId} agents={agents} />
      <div className='flex flex-col gap-2'>
        <ThemeToggle />
        <Account userId={props.userId} />
      </div>
    </aside>
  )
};

export default Sidebar;
