import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { Button } from 'src/components/Button';
import constants from 'src/constants';
import { Agent as AgentType, Tab as TabType} from 'src/types';

interface Props {
  userId: string;
  agent: AgentType;
  tabs: TabType[];
  currentThreadId: string;
  currentThreadPositionY: number;
};

const AddTab = (props: Props) => {
  const navigate = useNavigate();
  const isAddTabDisabled = props.tabs.length > constants.tabMaxLength;

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
    const updatedTabs = props.tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: false }
      : t
    );
    const newTab = { id: threadId, agentId: props.agent.id, title: null, isActive: true };
    updatedTabs.push(newTab);
    tabsStorage.save(props.agent.name, updatedTabs);

    /** Dispatch tabsUpdated event (Events) */
    const event = new CustomEvent('tabsUpdated', {
      detail: { agent: props.agent.name }
    });
    window.dispatchEvent(event);
    
    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: props.currentThreadId,
      positionY: props.currentThreadPositionY
    });
    
    navigate(`/${props.agent.name}/${threadId}`);
  };
  
  return (
    <Button
      disabled={isAddTabDisabled}
      variant='outline'
      size='icon'
      className='w-8 h-8 ml-2 p-0 rounded-full'
      onClick={() => handleAddTab(props.userId, props.agent.id)}
    >
      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
      </svg>
    </Button>
  )
};

export default AddTab;