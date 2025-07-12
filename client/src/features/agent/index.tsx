import { useParams } from 'react-router-dom';
import { indexedDB } from 'src/storage/indexedDB';
import Tabs from './Tabs';
import { Actions } from './Actions';
import Thread from 'src/features/thread';

interface AgentProps {
  userId: string;
};

const Agent = (props: AgentProps) => {
  const { agentName } = useParams<{ agentName: string }>();
  const agent = indexedDB.getAgent(agentName);
  if (!agent) return;

  return (
    <div className='ml-[52px] flex flex-col p-2'>
      <header className='flex justify-between items-center pb-2 border-b-1 border-border'>
        <Tabs userId={props.userId} agent={agent} />
        <Actions userId={props.userId} agentId={agent.id} />
      </header>
      <Thread />
    </div>
  )
};

export default Agent;
