import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import hooks from 'src/hooks';
import Error from 'src/components/error';
import Sidebar from 'src/features/workspace/sidebar';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import styles from './Workspace.module.css';

interface Props {
  userId: string;
}

const Workspace = ({ userId }: Props) => {
  const isMobile = hooks.features.useHandleBreakpoint({ windowInnerWidth: 480 });
  const { workspaces, error, isLoading } = hooks.features.useHandleWorkspaces({ userId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!workspaces) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className={styles.workspaceWrapper}>
      <div className={styles.workspaceContainer}>
        <Sidebar
          userId={userId}
          workspaces={workspaces}
          isMobile={isMobile}
        />
        <Outlet />
      </div>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            color: 'white',
            border: '1px solid var(--border)',
            outline: 'none',
            background: 'black',
          },
        }}
      />
    </div>
  );
};

export default Workspace;

const Loading = () => {
  return (
    <div className={styles.workspaceWrapper}>
      <div className={styles.workspaceContainer}>
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