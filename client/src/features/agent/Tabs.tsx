import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { Button } from 'src/components/Button';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import createThread from 'src/actions/createThread';
import hooks from 'src/hooks';
import { cn } from 'src/utils/cn';
import constants from 'src/constants';
import { Agent as AgentType, Tab as TabType} from 'src/types';

interface TabsProps {
  userId: string;
  agent: AgentType;
};

const Tabs = (props: TabsProps) => {
  const tabs = hooks.useGetTabs(props.agent.name);
  if (!tabs) return null;

  return (
    <div className='max-w-[88%] flex gap-2'>
      {tabs.map(t => <Tab key={t.id} agent={props.agent} tab={t} tabs={tabs} /> )}
      <AddTab userId={props.userId} agent={props.agent} tabs={tabs} />
    </div>
  )
  
};

export default Tabs;

interface TabProps {
  agent: AgentType;
  tab: TabType;
  tabs: TabType[];
};

const Tab = (props: TabProps) => {
  const navigate = useNavigate();
  
  const handleSelectTab = (threadId: string, agentId: string) => {
    /** Update tabs */
    let updatedTabs = props.tabs.map(t =>
      t.agentId === agentId
        ? { ...t, isActive: t.id === threadId }
        : t
    );

    /** Save updated tabs (localStorage) */
    tabsStorage.save(props.agent.name, updatedTabs);

    /** Dispatch tabsUpdated event */
    const event = new CustomEvent('tabsUpdated', {
      detail: { agent: props.agent.name }
    });
    window.dispatchEvent(event);
    
    navigate(`/${props.agent.name}/${threadId}`);
  };

  const handleRemoveTab = (e: React.MouseEvent<HTMLButtonElement>, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    /** Update tabs */
    const removedTab = props.tabs.find(t => t.id === threadId);
    if (!removedTab) return;
    
    const updatedTabs = props.tabs.filter(t => t.id !== threadId);
    
    if (updatedTabs.length > 0 && removedTab.isActive) {
      updatedTabs[updatedTabs.length - 1].isActive = true;
    }

    /** Save updated tabs (localStorage) */
    tabsStorage.save(props.agent.name, updatedTabs);

    /** Dispatch tabsUpdated event */
    const event = new CustomEvent('tabsUpdated', {
      detail: { agent: props.agent.name }
    });
    window.dispatchEvent(event);

    if (props.tabs.length > 1) {
      navigate(`/${props.agent.name}/${updatedTabs[updatedTabs.length - 1].id}`);
    } else {
      navigate(`/${props.agent.name}`);
    };
  };
  
  return (
    <a
      href={`/${props.agent.name}/${props.tab.id}`}
      className={cn(
        'relative h-8 min-w-0 max-w-[140px] cursor-pointer group flex flex-1 items-center pl-3 pr-5 text-white rounded-full transition-colors duration-150',
        props.tab.isActive ? 'border border-blue-600 bg-blue-600 hover:bg-blue-600/80' : 'border border-border hover:border-white/20'
      )}
      onClick={() => handleSelectTab(props.tab.id, props.tab.agentId)}
    >
      <span className='text-xs font-semibold truncate flex-1 min-w-0 max-w-[100px] text-nowrap overflow-hidden'>
        {props.tab.title === null ? 'New chat' : props.tab.title}
      </span>
      {props.tabs.length > 1 && (
        <button
          className='absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150'
          onClick={(e) => handleRemoveTab(e, props.tab.id)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={cn('size-3', props.tab.isActive ? 'text-text-primary/80 hover:text-text-primary' : 'text-text-tertiary hover:text-primary')}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
          </svg>
        </button>
      )}
    </a>
  )
};

interface AddTabProps {
  userId: string;
  agent: AgentType;
  tabs: TabType[];
};

const AddTab = (props: AddTabProps) => {
  const navigate = useNavigate();
  const isAddTabDisabled = props.tabs.length > constants.tabMaxLength;

  const handleAddTab = async (userId: string, agentId: string) => {
    const threadId = uuidV4();
    const thread = await createThread(threadId, userId, agentId, props.agent.name);
    if (!thread) return;

    /** Update tabs */
    const updatedTabs = props.tabs.map(t =>
      t.agentId === agentId
        ? { ...t, isActive: false }
        : t
    )
    const newTab = { id: threadId, agentId: props.agent.id, title: null, isActive: true };
    updatedTabs.push(newTab);

    /** Save updated tabs (localStorage) */
    tabsStorage.save(props.agent.name, updatedTabs);

    /** Dispatch tabsUpdated event */
    const event = new CustomEvent('tabsUpdated', {
      detail: { agent: props.agent.name }
    });
    window.dispatchEvent(event);
    
    navigate(`/${props.agent.name}/${threadId}`)
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