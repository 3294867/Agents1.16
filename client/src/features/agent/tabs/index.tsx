import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Tab from './Tab';
import AddTab from './AddTab';
import { Agent } from 'src/types';

interface Props {
  userId: string;
  agent: Agent;
};

const Tabs = ({ userId, agent }: Props) => {
  const { threadId: currentThreadId } = useParams();
  const { tabs, currentThreadPositionY } = hooks.useHandleTabs({ agentName: agent.name });
  if (!tabs || !currentThreadId) return null;

  return (
    <div className='max-w-[88%] flex gap-2'>
      {tabs.map(t => (
        <Tab
          key={t.id}
          agent={agent}
          tab={t}
          tabs={tabs}
          currentThreadId={currentThreadId}
          currentThreadPositionY={currentThreadPositionY}
        />
      ))}
      <AddTab
        userId={userId}
        agent={agent}
        tabs={tabs}
        currentThreadId={currentThreadId}
        currentThreadPositionY={currentThreadPositionY}
      />
    </div>
  )
};

export default Tabs;