import { useParams } from 'react-router-dom';
import Tabs from './Tabs';
import { Actions } from './Actions';
import Thread from '../thread';

interface AgentProps {
  userId: string;
};

const Agent = (props: AgentProps) => {
  const { agent } = useParams<{ agent: string }>();
  if (!agent) return;
  return (
    <div className='ml-[52px] flex flex-col p-2'>
      <header className='flex justify-between items-center pb-2 border-b-1 border-border'>
        <Tabs userId={props.userId} agent={agent} />
        <Actions userId={props.userId} agent={agent} />
      </header>
      <Thread />
    </div>
  )
};

export default Agent;
