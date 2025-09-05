import { useOutletContext, useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Error from 'src/components/error';
import Header from './header';
import Chat from './chat';
import Form from './form';
import SideNavigation from './SideNav';
import Icons from 'src/assets/icons';
import { AgentModel, AgentType } from 'src/types';
import styles from './Thread.module.css'

interface OutletContext {
  userId: string;
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  agentModel: AgentModel;
  isMobile: boolean;
}

const Thread = () => {
  const { userId, workspaceId, workspaceName, agentId, agentName, agentType, agentModel, isMobile } = useOutletContext<OutletContext>();
  const { threadId } = useParams();
  const { thread, isLoading, error } = hooks.features.useHandleThread({ threadId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!workspaceName || !agentName || !threadId || !thread) return <Error error='Something went wrong. Try again later.' />;

  return (
    <main id='thread' className={styles.main}>
      {/* <Header
        userId={userId}
        workspaceName={workspaceName}
        agentName={agentName}
        threadId={threadId}
        threadName={thread.name}
        threadIsBookmarked={thread.isBookmarked}
      />
      <Chat
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        agentId={agentId}
        agentName={agentName}
        agentType={agentType}
        agentModel={agentModel}
        threadId={threadId}
        threadBody={thread.body}
      />
      <SideNavigation threadBody={thread.body} />
      <Form
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        agentId={agentId}
        agentName={agentName}
        agentModel={agentModel}
        threadId={threadId}
        threadBodyLength={thread.body.length}
      /> */}
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