import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Error from 'src/components/error';
import Sidebar from 'src/features/workspace/sidebar';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import styles from './Workspace.module.css';
import WorkspaceContext from './WorkspaceContext';
import utils from 'src/utils';

interface OutletContext {
  userId: string;
  isMobile: boolean;
}

const Workspace = () => {
  const { userId, isMobile } = useOutletContext<OutletContext>();
  const { workspaceName } = useParams();
  const { workspaces, error, isLoading } = hooks.features.useHandleWorkspace({ userId, workspaceName });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!userId || !workspaceName || !workspaces) return <Error error="Something went wrong. Try again later" />;

  const workspaceId = utils.features.getWorkspaceId({ workspaceName, workspaces });

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
    <div className={styles.container}>
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
    <div className={styles.container}>
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