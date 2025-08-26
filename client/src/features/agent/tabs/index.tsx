import { useParams } from 'react-router-dom';
import hooks from 'src/hooks';
import Tab from './Tab';
import AddTab from './AddTab';
import { Agent, Team } from 'src/types';

interface Props {
  userId: string;
  team: Team;
  agent: Agent;
}

const Tabs = ({ userId, team, agent }: Props) => {
  const { threadId: currentThreadId } = useParams();
  const { tabs, currentThreadPositionY } = hooks.features.useHandleTabs({ teamName: team.name, agentName: agent.name });
  if (!tabs || !currentThreadId) return null;

  return (
    <div style={{ maxWidth: '88%', display: 'flex', gap: '8px' }}>
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
  );
};

export default Tabs;