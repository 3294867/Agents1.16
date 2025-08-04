import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Error from 'src/components/Error';
import Header from './header';
import Chat from './chat';
import Form from './form';
import SideNavigation from './SideNav';
import styles from './Thread.module.css'
import { AgentModel } from 'src/types';
import Icons from 'src/assets/Icons';

interface Props {
  userId: string;
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
}

const Thread = ({ userId, agentId, agentName, agentModel }: Props) => {
  const { threadId } = useParams();
  const { thread, isLoading, error } = hooks.useHandleThread({ threadId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!threadId || !thread) return <Error error='Something went wrong. Try again later.' />;
  
  const threadTitle = thread.title;
  const threadBody = thread.body;
  const threadBodyLength = Object.keys(thread.body).length;

  return (
    <main id='thread' className={styles.main}>
      <Header
        threadId={threadId}
        threadTitle={threadTitle}
        isBookmarked={thread.isBookmarked}
        agentName={agentName}
      />
      <Chat
        userId={userId}
        agentId={agentId}
        agentName={agentName}
        threadId={threadId}
        threadBody={threadBody}
        agentModel={agentModel}
      />
      <Form
        agentId={agentId}
        agentName={agentName}
        agentModel={agentModel}
        threadId={threadId}
        threadBodyLength={threadBodyLength}
      />
      <SideNavigation threadBody={threadBody} threadBodyLength={threadBodyLength} />
    </main>
  );
};

export default Thread;

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <Icons.Loader className={styles.loadingSpinner} />
    </div>
  );
};