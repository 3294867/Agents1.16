import { useNavigate } from 'react-router-dom';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import { cn } from 'src/utils/cn';
import { Agent as AgentType, Tab as TabType} from 'src/types';
import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  agent: AgentType;
  tab: TabType;
  tabs: TabType[];
  currentThreadId: string;
  currentThreadPositionY: number;
};

const Tab = ({ agent, tab, tabs, currentThreadId, currentThreadPositionY }: Props) => {
  const navigate = useNavigate();
  
  const handleSelectTab = async (threadId: string, agentId: string) => {
    /** Update tabs (localStorage) */
    const updatedTabs = tabs.map(t => t.agentId === agentId
      ? { ...t, isActive: t.id === threadId }
      : t
    );
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

  const handleRemoveTab = async (e: React.MouseEvent<HTMLButtonElement>, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    /** Update tabs (localStorage) */
    const removedTab = tabs.find(t => t.id === threadId);
    if (!removedTab) return;
    const updatedTabs = tabs.filter(t => t.id !== threadId);
    if (updatedTabs.length > 0 && removedTab.isActive) {
      updatedTabs[updatedTabs.length - 1].isActive = true;
    }
    tabsStorage.save(agent.name, updatedTabs);

    /** Dispatch tabsUpdated event (Events) */
    dispatchEvent.tabsUpdated(agent.name);

    /** Update positionY of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({
      threadId: currentThreadId,
      positionY: currentThreadPositionY
    });

    if (tabs.length > 1) {
      navigate(`/${agent.name}/${updatedTabs[updatedTabs.length - 1].id}`);
    } else {
      navigate(`/${agent.name}`);
    };
  };
  
  return (
    <a
      href={`/${agent.name}/${tab.id}`}
      className={cn(
        'relative h-8 min-w-0 max-w-[140px] cursor-pointer group flex flex-1 items-center pl-3 pr-5 text-white rounded-full transition-colors duration-150',
        tab.isActive ? 'border border-blue-600 bg-blue-600 hover:bg-blue-600/80' : 'border border-border hover:border-white/20'
      )}
      onClick={() => handleSelectTab(tab.id, tab.agentId)}
    >
      <span className='text-xs font-semibold truncate flex-1 min-w-0 max-w-[100px] text-nowrap overflow-hidden'>
        {tab.title === null ? 'New chat' : tab.title}
      </span>
      {tabs.length > 1 && (
        <button
          className='absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150'
          onClick={(e) => handleRemoveTab(e, tab.id)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={cn('size-3', tab.isActive ? 'text-text-primary/80 hover:text-text-primary' : 'text-text-tertiary hover:text-primary')}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
          </svg>
        </button>
      )}
    </a>
  )
};

export default Tab;