import { Outlet } from 'react-router-dom';
import Sidebar from 'src/features/layout/sidebar';
import useHandleBreakpoint from 'src/hooks/useHandleBreakpoint';
import hooks from 'src/hooks';

interface Props {
  userId: string;
};

const Layout = ({ userId }: Props) => {
  const isMobile = useHandleBreakpoint({ windowInnerWidth: 480 });
  const agents = hooks.useGetAgents({ userId });
  if (!agents) return null;

  return (
    <div className='bg-background'>
      <div className='min-h-screen w-full mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl xs:border-x-[1px] border-border bg-background'>
        <Sidebar userId={userId} agents={agents} isMobile={isMobile} />
        <Outlet />
      </div>
    </div>
  )
};

export default Layout;