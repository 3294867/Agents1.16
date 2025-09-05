import { memo } from 'react';
import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Tab from './Tab';
import AddTab from './AddTab';

const Tabs = memo(() => {
  const { workspaceName, agentName } = hooks.features.useAgentContext();
  const { threadId: currentThreadId } = useParams();
  const { tabs, currentThreadPositionY } = hooks.features.useHandleTabs({ workspaceName, agentName });
  if (!tabs || !currentThreadId) return null;

  return (
    <div style={{ maxWidth: '72%', display: 'flex', gap: '0.5rem' }}>
      {tabs.map(t => (
        <Tab
          key={t.id}
          tab={t}
          tabs={tabs}
          currentThreadId={currentThreadId}
          currentThreadPositionY={currentThreadPositionY}
        />
      ))}
      <AddTab
        tabs={tabs}
        currentThreadId={currentThreadId}
        currentThreadPositionY={currentThreadPositionY}
      />
    </div>
  );
});

export default Tabs;