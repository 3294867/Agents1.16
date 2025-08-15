import { useParams } from 'react-router-dom';
import Tabs from './tabs';
import Actions from './Actions';
import Thread from 'src/features/thread';
import Error from 'src/components/error';
import Button from 'src/components/button';
import hooks from 'src/hooks';
import Icons from 'src/assets/icons';
import styles from './Agent.module.css';

interface Props {
  userId: string;
}

const Agent = ({ userId }: Props) => {
  const { agentName } = useParams();
  const { agent, error, isLoading } = hooks.useGetAgent({ userId, agentName });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!agentName || !agent) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Tabs userId={userId} agent={agent} />
        <Actions userId={userId} agentId={agent.id} />
      </header>
      <Thread
        userId={userId}
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