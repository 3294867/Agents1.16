import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Error from 'src/components/error';
import Sidebar from 'src/features/workspace/sidebar';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import WorkspaceContext from './WorkspaceContext';
import styles from './Workspace.module.css';

interface OutletContext {
  userId: string;
  isMobile: boolean;
}

const Workspace = () => {
  const { userId, isMobile } = useOutletContext<OutletContext>();
  const { workspaceName } = useParams();
  const { workspaces, error, isLoading } = hooks.features.useHandleWorkspace({ userId, workspaceName });

  if (isLoading) return <Loading />;
  if (error || !userId || !workspaceName || !workspaces) return <Error error={error ?? 'Something went wrong. Try again later.'} />;

  const workspaceId = workspaces
    .filter(i => i.name === workspaceName)
    .map(i => i.id)[0];

  const workspaceContext = {
    userId,
    workspaceName,
    workspaces,
    isMobile
  };

  const outletContext = {
    userId,
    workspaceId,
    workspaceName,
    isMobile
  };

  return (
    <div className={styles.workspaceContainer}>
      <WorkspaceContext.Provider value={workspaceContext}>
        <Sidebar />
      </WorkspaceContext.Provider>
      <Outlet context={outletContext} />
    </div>
  );
};

export default Workspace;

const Loading = () => {
  return (
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
  );
};