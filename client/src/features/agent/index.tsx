import { useParams } from 'react-router-dom';
import { EllipsisVerticalIcon, HistoryIcon, LoaderIcon } from 'lucide-react';
import Tabs from './tabs';
import Actions from './Actions';
import Thread from 'src/features/thread';
import Error from 'src/components/Error';
import { Button } from 'src/components/Button';
import hooks from 'src/hooks';

interface Props {
  userId: string;
};

const Agent = ({ userId }: Props) => {
  const { agentName } = useParams();
  const { agent, error, isLoading } = hooks.useGetAgent({ userId, agentName });

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!agentName || !agent) return <Error error='Something went wrong. Try again later.' />;

  return (
    <div className='relative ml-[52px] flex flex-col px-2'>
      <header className='z-10 sticky top-0 flex justify-between items-center py-2 border-b-1 border-border bg-background'>
        <Tabs userId={userId} agent={agent} />
        <Actions userId={userId} agentId={agent.id} />
      </header>
      <Thread
        userId={userId}
        agentId={agent.id}
        agentName={agentName}
        agentModel={agent.model}
      />
    </div>
  )
};

export default Agent;

const Loading = () => {
  return (
    <div className='ml-[52px] min-h-screen flex flex-col p-2'>
      <header className='flex justify-between items-center pb-2 border-b-1 border-border'>
        <div className='h-8 w-[140px] rounded-full border border-border' />
        <div className='flex gap-1.5 items-center'>
          <Button disabled={true} variant='outline' size='icon' className='w-8 h-8 p-0 rounded-full'>
            <HistoryIcon className='w-4 h-4' />
          </Button>
          <Button disabled={true} variant='outline' size='icon' className='w-8 h-8 p-0 rounded-full'>
            <EllipsisVerticalIcon className='size-4' />
          </Button>
        </div>
      </header>
      <div className='w-[640px] h-full mx-auto flex justify-center items-center'>
        <LoaderIcon className='w-5 h-5 text-white animate-spin' />
      </div>
    </div>
  )
};