import { Outlet, useParams } from 'react-router-dom';
import Error from 'src/components/error';
import AgentsDropdown from './AgentsDropdown';
import Tabs from './tabs';
import Actions from './Actions';
import Button from 'src/components/button';
import hooks from 'src/hooks';
import Icons from 'src/assets/icons';
import styles from './Agent.module.css';

interface Props {
  userId: string;
}

const Agent = ({ userId }: Props) => {
  const { workspaceName, agentName } = useParams();
  const { agent, error, isLoading } = hooks.features.useHandleAgent({ workspaceName, agentName });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!workspaceName || !agentName || !agent) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <AgentsDropdown
            workspaceId={agent.workspaceId}
            workspaceName={workspaceName}
            agentName={agentName}
          />
          <div className={styles.separator} />
          <Tabs
            workspaceId={agent.workspaceId}
            workspaceName={workspaceName}
            agentId={agent.id}
            agentName={agent.name}
          />
        </div>
        <Actions userId={userId} agentId={agent.id} />
      </header>
      <Outlet context={{ userId, workspaceName, agentName }} />
    </div>
  );
};

export default Agent;

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <header className={styles.loadingHeader}>
        <div className={styles.loadingTab} />
        <div className={styles.loadingActions}>
          <Button disabled={true} variant='outline' size='icon'>
            <Icons.History />
          </Button>
          <Button disabled={true} variant='outline' size='icon'>
            <Icons.More />
          </Button>
        </div>
      </header>
      <div className={styles.loadingContent}>
        <Icons.Loader className={styles.loadingSpinner} />
      </div>
    </div>
  );
};