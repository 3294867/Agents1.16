import { v4 as uuidV4 } from 'uuid';
import { Button } from 'src/components/Button';
import { Agent as AgentType, Tab } from 'src/types';
import { cn } from 'src/utils/cn';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import createThread from 'src/actions/createThread';

interface TabsProps {
  userId: string;
  agent: AgentType;
};

const Tabs = (props: TabsProps) => {
  const navigate = useNavigate();
  const [ tabs, setTabs ] = useState<Tab[] | null>(null);

  useEffect(() => {
    if (!props.agent) return;
    const savedTabs = tabsStorage.load(props.agent.name);
    if (savedTabs !== null) setTabs(savedTabs);
    return () => setTabs(null);
  },[props.agent]);

  if (!tabs) return;

  const handleSelectTab = (threadId: string, agentId: string) => {
    let updatedTabs: Tab[] = [];
    for (const t of tabs) {
      if (t.agentId === agentId) {
        t.isActive = (t.id === threadId) ? true : false;
      };
      updatedTabs.push(t);
    };
    tabsStorage.save(props.agent.name, updatedTabs);
    setTabs(updatedTabs);
    navigate(`/${props.agent.name}/${threadId}`);
  };

  const handleAddTab = (userId: string, agentId: string) => {
    const id = uuidV4();
    createThread(id, userId, agentId, props.agent.name)
      .then((response: Tab | null) => {
        if (response !== null) {
          let updatedTabs: Tab[] = [];
          for (const t of tabs) {
            if (t.agentId === agentId) t.isActive = false;
            updatedTabs.push(t);
          };
          const newTab = {...response, isActive: true};
          updatedTabs.push(newTab);
          tabsStorage.save(props.agent.name, updatedTabs);
          setTabs(updatedTabs);
          navigate(`/${props.agent.name}/${id}`)
        } 
      } 
    );
  };

  const handleRemoveTab = (e: React.MouseEvent<HTMLButtonElement>, threadId: string) => {
    e.stopPropagation();
    const removedTab = tabs.find(t => t.id === threadId);
    if (!removedTab) return;
    
    let updatedTabs: Tab[] = tabs;
    updatedTabs = updatedTabs.filter(t => t.id !== threadId);
    
    if (removedTab.isActive) {
      updatedTabs[updatedTabs.length - 1].isActive = true;
    }
    const updatingTabs = tabsStorage.save(props.agent.name, updatedTabs);
    setTabs(updatedTabs);
    if (updatingTabs) {
      if (tabs.length > 1) {
        navigate(`/${props.agent.name}/${updatedTabs[updatedTabs.length - 1].id}`)
      } else {
        navigate(`/${props.agent.name}`);
      };
    }    
  };

  return (
    <div className='max-w-[88%] flex gap-2'>
      {tabs.map(t => (
        <a
          key={t.id}
          href={`/${props.agent.name}/${t.id}`}
          className={cn(
            'relative h-8 min-w-0 max-w-[140px] cursor-pointer group flex flex-1 justify-between items-center text-white rounded-full transition-colors duration-150',
            t.isActive ? 'border border-blue-600 bg-blue-600 hover:bg-blue-600/80' : 'border border-border hover:border-white/20'
          )}
          onClick={() => handleSelectTab(t.id, t.agentId)}
        >
          <div className={cn('flex items-center gap-2 pl-4 py-1 w-full min-w-0',
            tabs.length === 1 ? 'pr-4' : 'pr-2'
          )}>
            <span className='text-xs font-semibold truncate flex-1 min-w-0 max-w-[120px] text-nowrap overflow-hidden'>
              {t.title === null ? 'New chat' : t.title}
            </span>
            {tabs.length > 1 && (
              <button
                className='w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150'
                onClick={(e) => handleRemoveTab(e, t.id)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={cn('size-3', t.isActive ? 'text-text-primary/80 hover:text-text-primary' : 'text-text-tertiary hover:text-primary')}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </a>
      ))}
      <Button
        disabled={tabs.length >= 15}
        variant='outline'
        size='icon'
        className='w-8 h-8 ml-2 p-0 rounded-full'
        onClick={() => handleAddTab(props.userId, props.agent.id)}
      >
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </Button>
    </div>
  )
  
};

export default Tabs;