import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import getAgents from 'src/actions/getAgents';
import { useHandleBreakpoint } from 'src/hooks/useHandleBreakpoint';
import { useEffect, useState } from 'react';
import { Agent } from 'src/types';

interface LayoutProps {
  userId: string;
};

const Layout = (props: LayoutProps) => {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const isMobile = useHandleBreakpoint({ windowInnerWidth: 480 });
  
  useEffect(() => {
    const gettingAgents = async () => {
      const agents = await getAgents(props.userId)
      if (agents) {
        setAgents(agents);
      }
    }
    gettingAgents();

    return () => setAgents(null);
  },[getAgents])

  if (!agents) return null;

  return (
    <div className='h-screen bg-background'>
      <div className='h-full w-full mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl xs:border-x-[1px] border-border'>
        <Sidebar userId={props.userId} agents={agents} isMobile={isMobile} />
        <Outlet />
      </div>
    </div>
  )
};

export default Layout;