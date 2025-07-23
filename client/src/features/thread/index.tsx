import { LoaderIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Error from 'src/components/Error';
import Header from './Header';
import Chat from './chat';
import SideNavigation from './SideNav';
import hooks from 'src/hooks';
import { AgentModel } from 'src/types';
import Form from './form';

interface Props {
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
};

const Thread = ({ agentId, agentName, agentModel }: Props) => {
  const { threadId } = useParams();
  const { thread, isLoading, error } = hooks.useHandleThread({ threadId });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!threadId || !thread) return <Error error='Something went wrong. Try again later.' />;
  
  const threadTitle = thread.title;
  const threadBody = thread.body;
  const threadBodyLength = Object.keys(thread.body).length;

  return (
    <main id='thread' className='relative w-[640px] mx-auto flex flex-col mt-8'>
      <Header threadId={threadId} threadTitle={threadTitle} />
      <Chat threadId={threadId} threadBody={threadBody} agentModel={agentModel} />
      <Form agentId={agentId} agentName={agentName} agentModel={agentModel} threadId={threadId} threadBodyLength={threadBodyLength} />
      <SideNavigation threadBody={threadBody} threadBodyLength={threadBodyLength} />
    </main>
  );
};

export default Thread;

const Loading = () => {
  return (
    <div className='w-[640px] h-full mx-auto flex justify-center items-center'>
      <LoaderIcon className='w-5 h-5 text-white animate-spin' />
    </div>
  );
};