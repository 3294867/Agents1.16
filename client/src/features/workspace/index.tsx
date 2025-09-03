import { Outlet, useParams } from 'react-router-dom';
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
  const { workspaceName } = useParams();
  const { workspaces, error, isLoading } = hooks.features.useHandleWorkspace({ userId, workspaceName });
  const isMobile = hooks.features.useHandleBreakpoint({ windowInnerWidth: 480 });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!userId || !workspaceName || !workspaces) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className={styles.container}>
      <Sidebar
        userId={userId}
        currentWorkspaceName={workspaceName}
        workspaces={workspaces}
        isMobile={isMobile}
      />
      <Outlet context={{ userId, workspaceName }}/>
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