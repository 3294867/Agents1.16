import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import dispatchEvent from 'src/events/dispatchEvent';
import { Button } from 'src/components/Button';
import constants from 'src/constants';
import Icons from 'src/assets/Icons';
import { Agent as AgentType, Tab as TabType} from 'src/types';

interface Props {
  userId: string;
  agent: AgentType;
  tabs: TabType[];
  currentThreadId: string;
  currentThreadPositionY: number;
}

const AddTab = ({ userId, agent, tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  const isAddTabDisabled = tabs.length > constants.tabMaxLength;

  const handleAddTab = async (userId: string, agentId: string) => {
    /** Create thread (PostgresDB) */
    const threadId = uuidV4();
    const thread = await postgresDB.createThread({
      id: threadId, userId, agentId
    });
    if (!thread) return;

    /** Add thread (IndexedDB) */
    const updatedThread = { ...thread, positionY: 0 };
    await indexedDB.addThread({ thread: updatedThread });

    /** Update tabs (localStorage) */
    const updatedTabs = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: false }
      : t
    );
    const newTab = { id: threadId, agentId: agent.id, title: null, isActive: true };
    updatedTabs.push(newTab);
    tabsStorage.save(agent.name, updatedTabs);

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated(agent.name);
    
    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });
    
    navigate(`/${agent.name}/${threadId}`);
  };
  
  return (
    <Button
      disabled={isAddTabDisabled}
      variant='outline'
      size='icon'
      style={{ width: '2rem', height: '2rem' }}
      onClick={() => handleAddTab(userId, agent.id)}
    >
      <Icons.Add />
    </Button>
  );
};

export default AddTab;