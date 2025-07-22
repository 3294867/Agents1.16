import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Tab from './Tab';
import AddTab from './AddTab';
import { Agent as AgentType } from 'src/types';

interface TabsProps {
  userId: string;
  agent: AgentType;
};

const Tabs = (props: TabsProps) => {
  const { threadId: currentThreadId } = useParams();
  const { tabs, currentThreadPositionY } = hooks.useHandleTabs({ agentName: props.agent.name });
  if (!tabs || !currentThreadId) return null;

  return (
    <div className='max-w-[88%] flex gap-2'>
      {tabs.map(t => (
        <Tab
          key={t.id}
          agent={props.agent}
          tab={t}
          tabs={tabs}
          currentThreadId={currentThreadId}
          currentThreadPositionY={currentThreadPositionY}
        />
      ))}
      <AddTab
        {...props}
        tabs={tabs}
        currentThreadId={currentThreadId}
        currentThreadPositionY={currentThreadPositionY}
      />
    </div>
  )
};

export default Tabs;