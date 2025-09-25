import { useOutletContext, useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Error from 'src/components/error';
import ThreadContext from './ThreadContext';
import Header from './header';
import Chat from './chat';
import SideNav from './SideNav';
import Form from './form';
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
  const { userId, workspaceId, workspaceName, agentId, agentName, agentType, agentModel, isMobile }
    = useOutletContext<OutletContext>();
  const { threadId } = useParams();
  const { thread, isLoading, error } = hooks.features.useHandleThread({
    workspaceId,
    workspaceName,
    agentId,
    agentName,
    threadId
  });

  if (isLoading) return <Loading />;
  if (error || !workspaceName || !agentName || !threadId || !thread) {
    return <Error error={error ?? 'Something went wrong. Try again later.'} />;
  }

  const threadContext = {
    userId,
    workspaceId,
    workspaceName,
    agentId,
    agentName,
    agentType,
    agentModel,
    threadId: thread.id,
    threadName: thread.name,
    threadBody: thread.body,
    threadBodyLength: thread.body.length,
    threadIsBookmarked: thread.isBookmarked,
    threadIsShared: thread.isShared,
    threadIsActive: thread.isActive,
    threadPositionY: thread.positionY,
    isMobile
  };

  return (
    <main id='thread' className={styles.main}>
      <ThreadContext.Provider value={threadContext}>
        <Header />
        <Chat />
        <SideNav />
        <Form />
      </ThreadContext.Provider>
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