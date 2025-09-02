import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Tab from './Tab';
import AddTab from './AddTab';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
}

const Tabs = ({ workspaceId, workspaceName, agentId, agentName }: Props) => {
  const { threadId: currentThreadId } = useParams();
  const { tabs, currentThreadPositionY } = hooks.features.useHandleTabs({ workspaceName, agentName });
  if (!tabs || !currentThreadId) return null;

  return (
    <div style={{ maxWidth: '72%', display: 'flex', gap: '0.5rem' }}>
      {tabs.map(t => (
        <Tab
          key={t.id}
          workspaceName={workspaceName}
          agentName={agentName}
          tab={t}
          tabs={tabs}
          currentThreadId={currentThreadId}
          currentThreadPositionY={currentThreadPositionY}
        />
      ))}
      <AddTab
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        agentId={agentId}
        agentName={agentName}
        tabs={tabs}
        currentThreadId={currentThreadId}
        currentThreadPositionY={currentThreadPositionY}
      />
    </div>
  );
};

export default Tabs;