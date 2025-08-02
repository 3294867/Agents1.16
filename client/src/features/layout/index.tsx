import { Outlet } from 'react-router-dom';
import Sidebar from 'src/features/layout/sidebar';
import useHandleBreakpoint from 'src/hooks/useHandleBreakpoint';
import hooks from 'src/hooks';
import Error from 'src/components/Error';
import styles from './Layout.module.css';
import { Button } from 'src/components/Button';
import Icons from 'src/assets/Icons';

interface Props {
  userId: string;
}

const Layout = ({ userId }: Props) => {
  const isMobile = useHandleBreakpoint({ windowInnerWidth: 480 });
  const { agents, error, isLoading } = hooks.useGetAgents({ userId });
  
  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />
  if (!agents) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div style={{ backgroundColor: 'bg-background' }}>
      <div className='min-h-screen w-full mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl xs:border-x-[1px] border-border bg-background'>
        <Sidebar userId={userId} agents={agents} isMobile={isMobile} />
        <Outlet />
      </div>
    </div>
  )
};

export default Layout;

const Loading = () => {
  return (
    <div style={{ backgroundColor: 'bg-background' }}>
      <div className='min-h-screen w-full mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl xs:border-x-[1px] border-border bg-background'>
        <aside className={styles.sidebar}>
          <div className='flex mt-28'>
            <Button variant='outline' size='icon' />
          </div>
          <div className={styles.bottomSection}>
            <Button variant='outline' size='icon' />
            <Button variant='outline' size='icon' />
          </div>
        </aside>
        <div className={styles.agentContainer}>
          <Icons.Loader />
        </div>
      </div>
    </div>
  )
}