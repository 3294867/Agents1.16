import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import Error from 'src/components/error';
import AgentsDropdown from './AgentsDropdown';
import Tabs from './tabs';
import Actions from './Actions';
import Button from 'src/components/button';
import hooks from 'src/hooks';
import Icons from 'src/assets/icons';
import AgentContext from './AgentContext';
import styles from './Agent.module.css';

interface OutletContext {
  userId: string;
  workspaceId: string;
  workspaceName: string;
  isMobile: boolean;
}

const Agent = () => {
  const { userId, workspaceId, workspaceName, isMobile } = useOutletContext<OutletContext>();
  const { agentName } = useParams();
  const { agent, error, isLoading } = hooks.features.useHandleAgent({ workspaceName, agentName });

  if (isLoading) return <Loading />;
  if (error || !workspaceName || !agentName || !agent) return <Error error={error ?? 'Something went wrong. Try again later.'} />;

  const agentContext = {
    userId,
    workspaceId,
    workspaceName,
    agentId: agent.id,
    agentName,
    isMobile
  };
  
  const outletContext = {
    userId,
    workspaceId,
    workspaceName,
    agentId: agent.id,
    agentName,
    agentType: agent.type,
    agentModel: agent.model,
    isMobile
  };
  
  return (
    <div className={styles.agentContainer}>
      <AgentContext.Provider value={agentContext}>
        <header className={styles.header}>
          <div className={styles.wrapper}>
            <AgentsDropdown />
            <div className={styles.separator} />
            <Tabs />
          </div>
          <Actions />
        </header>
      </AgentContext.Provider>
      <Outlet context={outletContext} />
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