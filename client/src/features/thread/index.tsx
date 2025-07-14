import { LoaderIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Error from 'src/components/Error';
import Header from './Header';
import Chat from './Chat';
import Form from './Form';
import hooks from 'src/hooks';
import { AgentModel } from 'src/types';

interface ThreadProps {
  agentId: string;
  agentName: string;
  agentModel: AgentModel;
}

const Thread = (props: ThreadProps) => {
  const { threadId } = useParams<{ threadId: string | undefined }>();
  const { thread, isLoading, error } = hooks.useGetThread(threadId);
  
  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!threadId || !thread) return <Error error='Something went wrong. Try again later.' />;

  const threadBody = thread.body;
  const threadBodyLength = Object.keys(thread.body).length;
  const threadTitle = thread.title

  return (
    <main className='relative w-[640px] mx-auto flex flex-col my-8'>
      <Header threadId={threadId} threadTitle={threadTitle} />
      <Chat threadBody={threadBody} />
      <Form {...props} threadId={threadId} threadBodyLength={threadBodyLength} />
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