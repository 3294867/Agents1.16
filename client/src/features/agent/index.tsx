import { useParams } from 'react-router-dom';
import Error from 'src/components/error';
import Agents from './agents';
import Tabs from './tabs';
import Actions from './Actions';
import Thread from 'src/features/thread';
import Button from 'src/components/button';
import hooks from 'src/hooks';
import Icons from 'src/assets/icons';
import styles from './Agent.module.css';

interface Props {
  userId: string;
}

const Agent = ({ userId }: Props) => {
  const { teamName, agentName } = useParams();
  const { team, agents, agent, error, isLoading } = hooks.features.useHandleAgentData({ userId, teamName, agentName });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!teamName || !team || !agentName || !agents || !agent) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <Agents userId={userId} team={team} agents={agents} />
          <div className={styles.separator} />
          <Tabs userId={userId} team={team} agent={agent} />
        </div>
        <Actions userId={userId} agentId={agent.id} />
      </header>
      <Thread
        userId={userId}
        teamId={team.id}
        teamName={teamName}
        agentId={agent.id}
        agentName={agentName}
        agentType={agent.type}
        agentModel={agent.model}
      />
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