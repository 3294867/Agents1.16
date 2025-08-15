import { Outlet } from 'react-router-dom';
import hooks from 'src/hooks';
import Error from 'src/components/error';
import Sidebar from 'src/features/layout/sidebar';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import styles from './Layout.module.css';

interface Props {
  userId: string;
}

const Layout = ({ userId }: Props) => {
  const isMobile = hooks.useHandleBreakpoint({ windowInnerWidth: 480 });
  const { agents, error, isLoading } = hooks.useHandleAgents({ userId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!agents) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.layoutContainer}>
        <Sidebar userId={userId} agents={agents} isMobile={isMobile} />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

const Loading = () => {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.layoutContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.topSection}>
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
  );
};