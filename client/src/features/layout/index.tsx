import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import { useHandleBreakpoint } from 'src/hooks/useHandleBreakpoint';
import agentsStorage from 'src/utils/localStorage/agentsStorage';

interface LayoutProps {
  userId: string;
};

const Layout = (props: LayoutProps) => {
  agentsStorage.loadAgents(props.userId);
  const isMobile = useHandleBreakpoint({ windowInnerWidth: 480 });
  
  return (
    <div className='h-screen bg-background'>
      <div className='h-full w-full mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl xs:border-x-[1px] border-border'>
        <Sidebar userId={props.userId} isMobile={isMobile} />
        <Outlet />
      </div>
    </div>
  )
};

export default Layout;