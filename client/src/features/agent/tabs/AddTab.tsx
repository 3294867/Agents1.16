import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import Button from 'src/components/button';
import Icons from 'src/assets/icons';
import constants from 'src/constants';
import { Team, Agent as AgentType, Tab as TabType } from 'src/types';

interface Props {
  userId: string;
  team: Team;
  agent: AgentType;
  tabs: TabType[];
  currentThreadId: string;
  currentThreadPositionY: number;
}

const AddTab = ({ userId, team, agent, tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  const isAddTabDisabled = tabs.length > constants.tabMaxLength;

  const handleAddTab = async (userId: string, agentId: string) => {
    /** Create thread (PostgresDB) */
    const threadId = uuidV4();
    const thread = await postgresDB.addThread({
      id: threadId, userId, agentId
    });
    if (!thread) return;

    /** Update tabs (localStorage) */
    const updatedTabs = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: false }
      : t
    );
    const newTab = { id: threadId, teamId: team.id, agentId: agent.id, title: null, isActive: true };
    updatedTabs.push(newTab);
    tabsStorage.save(team.name, agent.name, updatedTabs);

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated(agent.name);
    
    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });
    
    navigate(`/${team.name}/${agent.name}/${threadId}`);
  };
  
  return (
    <Button
      disabled={isAddTabDisabled}
      variant='outline'
      size='icon'
      style={{ height: '2.25rem', width: '2.25rem' }}
      onClick={() => handleAddTab(userId, agent.id)}
    >
      <Icons.Add />
    </Button>
  );
};

export default AddTab;