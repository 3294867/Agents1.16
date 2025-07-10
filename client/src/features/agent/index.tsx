import { useParams } from 'react-router-dom';
import Tabs from './Tabs';
import { Actions } from './Actions';
import Thread from '../thread';
import { useEffect, useState } from 'react';
import { Agent as AgentType } from 'src/types';
import { db } from 'src/storage/indexedDB/db';

interface AgentProps {
  userId: string;
};

const Agent = (props: AgentProps) => {
  const { agentName } = useParams<{ agentName: string }>();

  const [agent, setAgent] = useState<AgentType | null>(null);

  useEffect(() => {
    if (!agentName) return;
    const gettingAgent = async () => {
      const agent = await db.agents.get({ name: agentName });
      if (agent) setAgent(agent);
    };
    gettingAgent();
  }, [agentName]);

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
